import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  loadProfile$!: Observable<any>;
  userProfile: any;
  authenticated: boolean = false;
  subMenuOpen: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
  ) {}

  ngOnInit(): void {
  }

  navigateTo(name: string = ''): void {
    this.router.navigate([name]);
  }

  logout(): void { }

  login(): void {
    this.router.navigate(['login']);
  }
}
