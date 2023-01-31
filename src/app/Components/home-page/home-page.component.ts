import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { DialogPageComponent } from '../dialog-page/dialog-page.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ServiceForMenuService } from 'src/app/Services/service-for-menu.service';

export interface Vegetable {
  name: string;
}
export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  onClickAddButtonStatus = false;
  newIdForClone = 50;
  onClickCloneButtonPressed = false;
  skillsLanguages = ['javascript', 'css', 'html', 'phython'];
  companyDetails: any;
  constructor(
    public dialogBox: MatDialog,
    private http: HttpClient,
    private service: ServiceForMenuService
  ) {
    this.getData();
  }
  // This function is used for getting data from json server
  getData() {
    this.http.get('http://localhost:3000/company').subscribe((res) => {
      this.companyDetails = res;
    });
  }
  ngOnInit(): void {
    this.getData();
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  languagesAndSkills: Fruit[] = [];

  // This method is used for search box
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our languages and skills
    if (value) {
      this.languagesAndSkills.push({ name: value });
      this.http
        .get('http://localhost:3000/company/?q=' + value)
        .subscribe((res) => {
          this.companyDetails = res;
        });
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  onClearClick() {
    this.companyDetails = this.service.detailsaAboutCompany;
    this.languagesAndSkills.splice(0, this.languagesAndSkills.length);
  }
  remove(fruit: Fruit): void {
    const index = this.languagesAndSkills.indexOf(fruit);

    if (index >= 0) {
      this.languagesAndSkills.splice(index, 1);
    }

    if (this.languagesAndSkills.length > 0) {
      let input;
      this.languagesAndSkills.forEach((el, ind) => {
        if (ind == this.languagesAndSkills.length - 1) {
          input = el.name;
        }
      });

      this.http
        .get('http://localhost:3000/company/?q=' + input)
        .subscribe((res) => {
          this.companyDetails = res;
        });
    } else {
      this.http.get('http://localhost:3000/company').subscribe((res) => {
        this.companyDetails = res;
      });
    }
  }

  edit(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove languages if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing language and skills
    const index = this.languagesAndSkills.indexOf(fruit);
    if (index >= 0) {
      this.languagesAndSkills[index].name = value;
    }
  }
  // This method is trigered when the user click Add button in the home page.
  onClickAddButton() {
    this.onClickAddButtonStatus = true;
    this.service.onClickAddButtonStatus(this.onClickAddButtonStatus);
    // After the boolean variable changes in the service, then dialog box will open here.
    this.dialogBox.open(DialogPageComponent);
    // This event is emited from service when a server call happens.
    this.service.editableCompanyDetails.subscribe((res) => {
      this.getData();
    });
  }
  vegetables: Vegetable[] = [{ name: 'apple' }, { name: 'banana' }];

  drop(event: CdkDragDrop<Vegetable[]>) {
    moveItemInArray(this.vegetables, event.previousIndex, event.currentIndex);
  }
  // This method is trigered when user is click edit button in the menu items.
  onClickEdit(id: any) {
    this.onClickAddButtonStatus = false;
    this.service.onClickAddButtonStatus(this.onClickAddButtonStatus);
    this.onClickCloneButtonPressed = false;
    this.service.onClickCloneButtonStatus(this.onClickCloneButtonPressed);
    this.service.editCompany(id);
    // This event is emited from service when a server call happens.
    this.service.editableCompanyDetails.subscribe((res) => {
      this.getData();
    });
  }
  // This method is trigered when user is click clone button in the menu items.
  onClickClone(id: any) {
    this.onClickCloneButtonPressed = true;
    this.service.onClickCloneButtonStatus(this.onClickCloneButtonPressed);
    this.service.createCloneOfCompany(id);
    // This event is emited from service when a server call happens.
    this.service.editableCompanyDetails.subscribe((res) => {
      this.getData();
    });
  }
  // This method is trigered when user is click delete button in the menu items.
  onClickDelete(id: any) {
    this.service.deleteTheRequestedCompany(id);
    this.service.editableCompanyDetails.subscribe((res) => {
      this.getData();
    });
  }
}
