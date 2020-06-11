import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class BaseService {
  protected baseUrl: string;

  constructor(protected http: HttpClient) {
    this.baseUrl = environment.ApiUrl;
  }

  protected get<Type>(url: string): Observable<Type> {
    return this.http.get<Type>(this.baseUrl + url);
  }

  protected post<Type>(url: string, data: Type, options?: any) {
    return this.http.post(this.baseUrl + url, data, options)
        .pipe(catchError(this.handleError));
  }

  protected put<Type>(url: string, data: Type) {
    return this.http.put(this.baseUrl + url, data)
        .pipe(catchError(this.handleError));
  }

  protected delete<Type>(url: string, data?: Type) {
    return this.http.delete(this.baseUrl + url, data)
        .pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }    
    return throwError(errorMessage);
  }
}
