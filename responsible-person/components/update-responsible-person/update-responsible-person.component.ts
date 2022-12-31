import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Table} from 'primeng/table';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { ResponsiblePerson } from '../../model/responsibleperson';
import { ResponsiblePersonService } from '../../services/responsible-person.service';

@Component({
  selector: 'app-update-responsible-person',
  templateUrl: './update-responsible-person.component.html',
  styleUrls: ['./update-responsible-person.component.css']
})
export class UpdateResponsiblePersonComponent implements OnInit {

  public isLoading: boolean = false;
  public isProgressBarLoading: boolean;
  responsiblePersonGroup: FormGroup;
  items: { label: string; url: string; }[];
  responsiblepersonGroup: ResponsiblePerson;
  responsiblepersonlist:any[];
  ResponsiblePrsonGroup: any;
  ResponsiblePerson: any;
  

  constructor(
    private fb: FormBuilder,
    private vendorService: ResponsiblePersonService,
    private messageService: MessageService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.responsiblePersonGroup = this.fb.group({
      responsiblepersonName: ["", [Validators.required]],
      responsiblepersonRole:[""],
      responsiblepersonUnit:[""],
      responsiblepersonStatus:[""],
      responsiblepersoDesignation:[""],
      responsiblepersonEmail:[""],
      responsiblepersonMobilenumber:[""],

    });
    this.items = [
      {label: 'AMS', url: '/'},
      {label: 'Operation / Update Responsible Person', url: '/update-responsible-person'}
  ];
     this.getResponsiblePersonByOid(this.activateRoute.snapshot.paramMap.get("oid"));
   
  }
   getResponsiblePersonByOid(id: string) {
    this.isLoading = true;
    this.vendorService.getResponsiblePersonByOid(id).subscribe(
      (res) => {
        if (res.status === 200) {
          this.ResponsiblePerson = res.body;
          this.setFormValue();
        }
      },
      (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.messageService.add({
            severity: "error",
            summary: err.error.message,
            detail: "",
          });
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  setFormValue() {
    this.responsiblePersonGroup.patchValue({
  
      responsiblepersonName: this.ResponsiblePerson.responsiblepersonName,
      responsiblepersonRole: this.ResponsiblePerson.responsiblepersonRole,
      responsiblepersonUnit: this.ResponsiblePerson.responsiblepersonUnit,
      responsiblepersonStatus: this.ResponsiblePerson.responsiblepersonStatus,
      responsiblepersoDesignation: this.ResponsiblePerson.responsiblepersoDesignation,
      responsiblepersonEmail: this.ResponsiblePerson.esponsiblepersonEmail,
      responsiblepersonMobilenumber: this.ResponsiblePerson.responsiblepersonMobilenumber,
    });
  }

  onCancel() {
    this.router.navigate(["responsible person"]);
  }

  onSubmit() {
    this.isLoading = true;
    if (this.responsiblePersonGroup.valid) {
      this.ResponsiblePerson
        .ResponsiblePersonVendor(
          this.responsiblepersonGroup.value,
          this.activateRoute.snapshot.paramMap.get("oid")
        )
        .subscribe(
          (res) => {
            if (res.status === 200) {
              this.messageService.add({
                severity: "success",
                summary: "Responsible Person updated Successfully",
                detail: "",
              });
              setTimeout(() => {
                this.router.navigate(["responsible person"]);
              }, 2000);
            }
          },
          (err) => {
            this.isLoading = false;
            if (err.error && err.error.message) {
              this.messageService.add({
                severity: "error",
                summary: err.error.message,
                detail: "",
              });
            }
          },
          () => {
            this.isLoading = false;
          }
        );
    } else {
      this.isLoading = false;
      this.messageService.add({
        severity: "error",
        summary: "Please fill up all the required fields",
        detail: "",
      });
    }
  }

}
