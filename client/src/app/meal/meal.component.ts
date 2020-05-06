import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MealComponent implements OnInit {
  meal: FormGroup;
  errMsg = null;
  @Output() updateMeal: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
  ) {
    const meal = modalData.meal;
    this.meal = new FormGroup({
      name: new FormControl(meal ? meal.name : null, [Validators.required]),
      calories: new FormControl(meal ? meal.calories : null, [Validators.required]),
      created_on: new FormControl(meal ? meal.created_on : null, [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  showError(msg) {
    this.snackBar.open(msg, null, {
      duration: 2000,
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const method = this.modalData.meal ? 'put' : 'post';
    const url = `/api/user/intake/${this.modalData.meal ? this.modalData.meal._id : ''}`;

    this.http[method](url, this.meal.value)
      .pipe(
        map((res) => res),
        catchError((err) => throwError(err))
      )
      .subscribe(
        (res) => {
          this.updateMeal.emit({
            ...(res || {}),
            ...this.modalData.meal,
            ...this.meal.value
          });
          this.showError(`Meal ${this.modalData.meal ? 'edited' : 'added'} successfully`);
          this.close();
        },
        (err) => this.errMsg = err.error.message
      );
  }
}
