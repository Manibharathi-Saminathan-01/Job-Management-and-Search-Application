import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPageComponent } from '../Components/dialog-page/dialog-page.component';

@Injectable({
  providedIn: 'root',
})
export class ServiceForMenuService implements OnInit {
  detailsaAboutCompany: any;
  initId = 1;
  idi = 50;
  onClickCloneButtonPressed: any;
  editableCompanyDetails = new EventEmitter();
  constructor(public http: HttpClient, private dialog: MatDialog) {
    this.http.get('http://localhost:3000/company').subscribe((res) => {
      this.detailsaAboutCompany = res;
      console.log(this.detailsaAboutCompany);
    });
  }
  dataFronServer: any;
  ngOnInit(): void {}
  companyNeedToEdit: any;
  comapanyIdForEdit: any;
  companyIdForClone: any;
  companyIdForDelete: any;
  addClick: any;
  // here gettind data from server
  getData() {
    this.http.get('http://localhost:3000/company').subscribe((res) => {
      this.detailsaAboutCompany = res;
    });
  }

  storageForClone = {
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
  // This method is help for add function.
  addNewCompany(data: any) {
    this.http.post('http://localhost:3000/company', data).subscribe((res) => {
      console.log(res);
      this.editableCompanyDetails.emit('added into server');
      this.getData();
    });
    this.initId++;
  }
  // This method is help for edit company details.
  editCompanyForDialog(value: any) {
    this.http
      .patch('http://localhost:3000/company/' + this.comapanyIdForEdit, value)
      .subscribe((res) => {
        console.log(res);
        this.editableCompanyDetails.emit('edited succesfully');
        this.getData();
        this.detailsaAboutCompany = res;
      });

    this.detailsaAboutCompany.forEach((el: any, index: any) => {
      if (el.id == this.comapanyIdForEdit) {
        this.detailsaAboutCompany.splice(index, 1);
      }
    });
    this.detailsaAboutCompany.push(value);
  }
  // This method is help for displaying prefilled values in the form.
  editCompany(id: any) {
    this.comapanyIdForEdit = id;
    for (let company of this.detailsaAboutCompany) {
      if (id == company.id) {
        this.companyNeedToEdit = JSON.parse(JSON.stringify(company));
      }
    }
    this.dialog.open(DialogPageComponent);
  }
  // This method is help for creating the clone of the company.
  cloneOfComp(data: any) {
    this.http.post('http://localhost:3000/company/', data).subscribe((res) => {
      this.editableCompanyDetails.emit('cloned succesfully');
      this.getData();
      this.detailsaAboutCompany = res;
    });
  }
  // This method is help full for prefiiled value in the form.
  createCloneOfCompany(id: any) {
    this.detailsaAboutCompany.forEach((el: any, ind: any) => {
      if (el.id == id) {
        this.storageForClone = JSON.parse(JSON.stringify(el));
        this.storageForClone.id = this.detailsaAboutCompany.length + 1;
      }
    });
    this.detailsaAboutCompany.push(this.storageForClone);

    this.idi++;
    this.dialog.open(DialogPageComponent);
  }
  // This method is help function for delete the requested company.
  deleteTheRequestedCompany(id: any) {
    this.detailsaAboutCompany.forEach((el: any, index: any) => {
      if (el.id == id) {
        this.detailsaAboutCompany.splice(index, 1);
      }
    });
    this.http.delete('http://localhost:3000/company/' + id).subscribe((res) => {
      this.getData();
      this.editableCompanyDetails.emit('deleted successfully');
      console.log(res);
    });
  }
  // Here we are maintained add button status.
  onClickAddButtonStatus(value: any) {
    this.addClick = value;
  }
  // Here we are maintained clone button status.
  onClickCloneButtonStatus(value: any) {
    this.onClickCloneButtonPressed = value;
  }
}
