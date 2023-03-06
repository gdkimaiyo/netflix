import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public saveUser(user: any): void {
    localStorage.removeItem("nflix_user");
    localStorage.setItem("nflix_user", JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem("nflix_user") || '{}');
  }

  public isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("nflix_user") || '[]');

    if (user && user?.length !== 0) {
      return true;
    }

    return false;
  }
}
