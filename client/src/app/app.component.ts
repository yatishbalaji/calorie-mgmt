import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'client';
  isLoggedIn = false;
  name;

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.auth.isAuthenticated.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
      if (this.isLoggedIn) {
        const userName = localStorage.getItem('user');
        this.name = JSON.parse(userName).name;
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserComponent);
  }
}
