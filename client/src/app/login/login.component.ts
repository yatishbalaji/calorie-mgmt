import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  login: FormGroup;
  errMsg = null;

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private route: Router,
    private dialog: MatDialog,
  ) {
    this.login = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.auth.login(this.login.value)
      .subscribe(
        (data) => this.route.navigateByUrl('/'),
        (err) => this.errMsg = err.message
      );
  }

  addUser() {
    const dialogRef = this.dialog.open(UserComponent);
  }
}
