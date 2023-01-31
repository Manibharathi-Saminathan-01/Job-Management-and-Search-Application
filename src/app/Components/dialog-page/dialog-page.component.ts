import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ServiceForMenuService } from 'src/app/Services/service-for-menu.service';

@Component({
  selector: 'app-dialog-page',
  templateUrl: './dialog-page.component.html',
  styleUrls: ['./dialog-page.component.scss'],
})
export class DialogPageComponent implements OnInit {
  myForm: any;
  preFillCompanyName: any;
  preFillCompanyNameForEdit: any;
  inputedCompanyDetails = {
    id: 0,
    company: '',
    logo: '',
    new: false,
    featured: false,
    possition: '',
    roll: '',
    level: '',
    postedAt: '',
    contract: '',
    location: '',
    language: [],
    tool: [],
  };
  companyDetailsFromServer: any;
  constructor(
    private http: HttpClient,
    private service: ServiceForMenuService
  ) {
    this.http.get('http://localhost:3000/company').subscribe((res) => {
      this.companyDetailsFromServer = res;
      console.log(this.companyDetailsFromServer);
    });
  }
  ngOnInit(): void {
    this.myForm = new FormGroup({
      company: new FormControl(null),
      logo: new FormControl(null),
      new: new FormControl(null),
      featured: new FormControl(null),
      possition: new FormControl(null),
      roll: new FormControl(null),
      level: new FormControl(null),
      postedAt: new FormControl(null),
      contract: new FormControl(null),
      location: new FormControl(null),
      language: new FormControl(null),
      tool: new FormControl(null),
    });
    this.preFillCompanyName = this.service.companyNeedToEdit;
    this.preFillCompanyNameForEdit = this.service.storageForClone;
    // Here is condition check happens. If add button pressed, edit button pressed or delete button pressed.
    if (this.service.addClick) {
      console.log('add button press');
      this.myForm.reset();
    } else if (this.service.onClickCloneButtonPressed) {
      console.log('clone button press');
      this.myForm.patchValue(this.preFillCompanyNameForEdit);
    } else {
      console.log('edit button press');
      this.myForm.patchValue(this.preFillCompanyName);
    }
  }

  languages: string[] = ['html', 'css', 'javascript', 'phython', 'ruby'];
  tools: string[] = [
    'html',
    'css',
    'javascript',
    'phython',
    'ruby',
    'react',
    'saas',
    'ror',
    'vue',
    'django',
  ];
  toppings = new FormControl('');

  editedCompany: any;
  // When the form content is filled then the form values recovered here and send the values to service for storing server.
  onSubmit() {
    // Condition check is happens. Act as a which button is pressed the call different type of methods in service.
    if (this.service.addClick) {
      this.inputedCompanyDetails = this.myForm.value;
      this.service.addNewCompany(this.inputedCompanyDetails);
      this.companyDetailsFromServer = this.service.detailsaAboutCompany;
      this.service.addClick = false;
    } else if (this.service.onClickCloneButtonPressed) {
      this.editedCompany = this.myForm.value;
      this.service.cloneOfComp(this.editedCompany);
    } else {
      this.editedCompany = this.myForm.value;
      this.service.editCompanyForDialog(this.editedCompany);
    }
  }
  autoFill(value: any) {
    this.myForm.patchValue(value);
    this.onClickCancel();
    this.onClickSubmit();
  }

  onClickCancel() {
    this.myForm.reset();
  }
  onClickSubmit() {}
}
