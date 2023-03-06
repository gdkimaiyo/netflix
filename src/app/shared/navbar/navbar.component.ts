import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { StorageService } from 'src/app/shared/services/storage.service';

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

  userProfile: any;
  authenticated: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {    
    if (this.storageService.isLoggedIn()) {
      this.authenticated = true;
    }

    this.userProfile = this.storageService.getUser();
  }

  navigateTo(name: string = ''): void {
    this.router.navigate([name]);
  }

  logout(): void {
    const action = {
      userId: this.userProfile?._id,
      action: 'Signed out of your account',
    };
    this.userService.saveUserLogs(action).subscribe((result) => {});
    this.authService.logout();
    this.router.navigate(['login']);
    this.authenticated = false;
  }

  login(): void {
    this.router.navigate(['login']);
  }
}
