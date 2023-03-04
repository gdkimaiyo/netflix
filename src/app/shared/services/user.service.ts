import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(`${environment.backendApi}/api/v1/users`);
  }

  saveUserLogs(payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/userlogs`, payload);
  }
}
