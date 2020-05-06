import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { merge, Observable, of as observableOf, fromEvent, Subject, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
// import * as moment from 'moment';

import { AuthService } from '../auth.service';
import { MealComponent } from '../meal/meal.component';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  intakeDatabase: IntakeHttpDatabase | null;
  isLoadingResults: boolean = true;
  resultsLength: number = 0;
  data: any[];
  intakes: any[];
  userSetting: {
    max_calories: number,
  };
  search: string = '';
  totalCalMap: {};
  displayedColumns: string[] = [
    'color', 'name', 'calories', 'created_on' , 'action'
  ];
  // selected = {
  //   startDate: moment('2015-11-18T00:00Z'),
  //   endDate: moment('2015-11-26T00:00Z'),
  // };
  // inlineDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment };
  clickStream = new Subject();
  docSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort

  constructor(
    private _httpClient: HttpClient,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService, 
  ) {
  }

  ngAfterViewInit() {
    this.intakeDatabase = new IntakeHttpDatabase(this._httpClient);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.clickStream.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.clickStream)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.intakeDatabase.getIntakes(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.intakes.length;
          this.userSetting = data.userSetting;
          this.totalCalMap = data.totalCalMap;
          return data.intakes;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.docSource.data = data);
  }

  getChipColor(name) {
    let color = '#ed3800';
    const x = name[0];
    switch (true) {
      case (x > 'P'):
          color = '#82b846'; 
          break;
      case (x > 'G'):
          color = '#f9ad0b';
          break;
    }

    return {'background-color': color};
  }

  showError(msg) {
    this.snackBar.open(msg, null, {
      duration: 2000,
    });
  }

  addMeal() {
    const dialogRef = this.dialog.open(MealComponent, {
      data: {
        meal: null,
      }
    });

    dialogRef.componentInstance.updateMeal
      .subscribe(data => {
        const dateStr = formatDate(data.created_on, 'dd-MM-yyyy', 'en-IN');

        this.totalCalMap[dateStr] = (
          this.totalCalMap[dateStr] || 0
        ) + data.calories;

        this.docSource.data = [...this.docSource.data, {
          ...data,
        }];
      });
  }

  editMeal(row) {
    const dialogRef = this.dialog.open(MealComponent, {
      data: {
        meal: row
      }
    });

    dialogRef.componentInstance.updateMeal
      .subscribe(data => {
        const dateStr = formatDate(data.created_on, 'dd-MM-yyyy', 'en-IN');

        this.totalCalMap[dateStr] = (
          this.totalCalMap[dateStr] || 0
        ) - row.calories + data.calories;

        this.docSource.data = this.docSource.data.map(x => {
          if (x._id === data._id) x = data;

          return x;
        });
      });
  }

  deleteMeal(row) {
    this._httpClient.delete(`/api/user/intake/${row._id}`)
        .pipe(
          map((res) => res),
          catchError((err) => throwError(err))
        )
        .subscribe(
          () => {
            const dateStr = formatDate(row.created_on, 'dd-MM-yyyy', 'en-IN');
    
            this.totalCalMap[dateStr] = (
              this.totalCalMap[dateStr] || 0
            ) - row.calories;

            this.docSource.data = this.docSource.data.reduce((acc, x) => {
              if (x._id !== row._id) {
                acc.push(x);
              }

              return acc;
            }, []);

            this.showError('Meal deleted successfully');
          },
          (err) => console.log(err.error.message)
        );
  }

  // chosenDate(chosenDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment }): void {
  //   console.log(chosenDate);
  //   this.inlineDate = chosenDate;
  // }
  // deleteMeal(row) {
  //   this.confirmDialogService.confirmThis("Are you sure to delete?",
  //   () => {  
  //     this._httpClient.delete(`/api/user/intake/${row._id}`)
  //       .pipe(
  //         map((res) => res),
  //         catchError((err) => throwError(err))
  //       )
  //       .subscribe(
  //         () => {
  //           this.docSource.data = this.docSource.data.reduce((acc, x) => {
  //             if (x._id !== row._id) {
  //               acc.push(x);
  //             }

  //             return acc;
  //           }, []);

  //           this.showError('Meal deleted successfully');
  //         },
  //         (err) => console.log(err.error.message)
  //       ); 
  //   },
  //   () => {});
  // }
}

export class IntakeHttpDatabase {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private _httpClient: HttpClient) { }

  getIntakes(
    sort: string, order: string, page: number
  ): Observable<any> {
    const href = '/api/user/intake';
    const requestUrl =
      `${href}?sort=${sort}&order=${order}&page=${page + 1}`;

    return this._httpClient.get<any>(requestUrl);
  }
}