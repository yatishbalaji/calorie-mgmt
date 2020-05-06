import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  user: FormGroup;
  errMsg = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
  ) {
    this.user = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      password: new FormControl(null, [Validators.required]),
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
    this.http.post(`/api/user`, this.user.value)
      .pipe(
        map(res => res),
        catchError((err) => throwError(err))
      )
      .subscribe(
        () => {
          this.showError('User added successfully');
          this.close();
        },
        (err) => this.errMsg = err.error.message
      );
  }
}
