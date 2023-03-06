import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StorageService } from 'src/app/shared/services/storage.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfile: any;
  userInitials: any;
  isHandset: boolean = false;
  avatarSize: number = 128;

  colorCodes = NOTIFICATION_CODES;

  constructor(
    public router: Router,
    private storageService: StorageService,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NzNotificationService
  ) { }

  ngOnInit(): void {    
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.breakpointObserver.observe(['(min-width: 575px)']).subscribe((state: BreakpointState) => {
      this.isHandset = (state.matches) ? false : true;
      this.avatarSize = (state.matches) ? 128 : 72;
    });

    this.userProfile = this.storageService.getUser();
    this.userInitials = `${this.userProfile?.firstname?.charAt(0)}${this.userProfile?.lastname?.charAt(0)}`;
  }

  updatePD(): void {
    this.sendNotification(
      'info',
      '',
      'Feature is in development. It will be available soon. ',
      this.colorCodes.info
    );
  }

  sendNotification(type: string, title: string, message: string, bgcolor: string): void {
    this.notificationService.create(type, title, message, {
      nzClass: 'notification',
      nzDuration: 5000,
      nzStyle: {
        backgroundColor: bgcolor,
        fontWeight: 500,
      },
      nzKey: 'toastmsg',
      nzPlacement: 'topRight',
    });
  }

}
