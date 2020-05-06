import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GenreService {
  data: any = [];
  headers: HttpHeaders = new HttpHeaders();

  constructor(
    private http: HttpClient,
  ) { }

  fetchList() {
    if (this.data.length) return of(this.data);

    return this.http.get(`api/genre`, {
      headers: this.headers.append('ignoreAuthModule', 'true'),
    })
      .pipe(map(
        res => {
          this.data = res;
          return res;
        },
        catchError(err => throwError(err.error))
      ));
  }

  updateGenres(genres) {
    this.data.push(...genres);
  }
}
