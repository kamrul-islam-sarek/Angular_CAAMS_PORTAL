import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Table} from 'primeng/table';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { ResponsiblePerson } from '../../model/responsibleperson';
import { ResponsiblePersonService } from '../../services/responsible-person.service';

@Component({
  selector: 'app-create-responsible-person',
  templateUrl: './create-responsible-person.component.html',
  styleUrls: ['./create-responsible-person.component.css']
})
export class CreateResponsiblePersonComponent implements OnInit {

  public isProgressBarLoading: boolean;
  public isLoading: boolean = false;
  responsiblepersonGroup: ResponsiblePerson;
  responsiblepersonlist:any[];
  items: { label: string; url: string; }[];
  ResponsiblePrsonGroup: any;

  constructor(
    private fb: FormBuilder,
    private responsiblepersonService: ResponsiblePersonService,
    private router: Router,
    private messageService: MessageService
  ) {

  }
  ngOnInit(): void {
    this.ResponsiblePrsonGroup = this.fb.group({
      responsiblepersonName: ["", [Validators.required]],
      responsiblepersonRole:[""],
      responsiblepersonUnit:[""],
      responsiblepersonStatus:[""],
      responsiblepersoDesignation:[""],
      responsiblepersonEmail:[""],
      responsiblepersonMobilenumber:[""],
      responsiblepersonPhotofilepath:[""]
    });
    this.items = [
      {label: 'AMS', url: '/'},
      {label: 'Operation / New Responsible Person', url: '/create-responsible-person'}
  ];
   
  }

  onCancel() {
    this.router.navigate(["responsible person"]);
  }

  onSubmit() {
    this.isLoading = true;
    if (this.responsiblepersonGroup.valid) {
      this.responsiblepersonService.saveResponsiblePerson(this.responsiblepersonGroup.value).subscribe(
        (res) => {
          if (res.status === 201) {
            this.messageService.add({
              severity: "success",
              summary: "Vendor saved Successfully",
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

