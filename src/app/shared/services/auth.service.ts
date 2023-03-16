import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/auth/register`, payload, httpOptions);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/auth/login`, payload, httpOptions);
  }

  verifyUser(payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/auth/verify`, payload, httpOptions);
  }

  updateProfile(payload: any, userId: string): Observable<any> {
    return this.http.put(`${environment.backendApi}/api/v1/auth/update/${userId}`, payload, httpOptions);
  }

  logout(): void {
    localStorage.removeItem("nflix_user");
  }
}
