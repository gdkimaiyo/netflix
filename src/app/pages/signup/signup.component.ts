import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

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
