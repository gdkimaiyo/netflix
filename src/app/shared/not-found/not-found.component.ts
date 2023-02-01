import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  size: NzButtonSize = 'default';

  constructor(public router: Router, private location: Location,) { }

  ngOnInit(): void {
  }

  navigateTo(name: string = ''): void {
    this.router.navigate([name]);
  }

  goBack(): void {
    this.location.back();
  }

}
