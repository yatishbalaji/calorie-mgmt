import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    MatButtonModule, MatIconModule, MatListModule,
    MatToolbarModule, MatDividerModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatDialogModule, MatAutocompleteModule, MatChipsModule, MatSnackBarModule,
    MatMenuModule, MatTooltipModule, MatDatepickerModule, MatNativeDateModule,
  ],
  exports: [
    MatButtonModule, MatIconModule, MatListModule,
    MatToolbarModule, MatDividerModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatDialogModule, MatAutocompleteModule, MatChipsModule, MatSnackBarModule,
    MatMenuModule, MatDatepickerModule, MatNativeDateModule
  ],
})

export class AngularMaterialModule { }