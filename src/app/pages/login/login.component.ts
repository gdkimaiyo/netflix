import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

}
