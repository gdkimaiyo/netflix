import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-update-profile-form',
  templateUrl: './update-profile-form.component.html',
  styleUrls: ['./update-profile-form.component.scss']
})
export class UpdateProfileFormComponent implements OnInit {

  form!: FormGroup;
  email: string | null = null;
  firstname: string | null = null;
  lastname: string | null = null;

  userProfile: any;
  @Output() updateCompleted = new EventEmitter<boolean>();
  @ViewChild('notifyContent', { static: false }) template?: TemplateRef<{}>;

  isLoading: boolean = false;

  colorCodes = NOTIFICATION_CODES;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userProfile = this.storageService.getUser();

    this.form = this.fb.group({
      firstname: [this.userProfile?.firstname, [Validators.required]],
      lastname: [this.userProfile?.lastname, [Validators.required]],
    });

    this.email = this.userProfile?.email;
  }

  onSubmit(form: { email: string; firstname: string; lastname: string }): void {
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }
    console.log(form);
  }

  updateProfile(): void {
    this.isLoading = true;
    
    // Terminate if form has errors
    if (!this.form.valid) {
      this.sendNotification('warning', '', 'All input fields are required', this.colorCodes.warning);

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
      return;
    }

    const payload = {
      email: this.email,
      firstname: this.formatName(this.form.value.firstname),
      lastname: this.formatName(this.form.value.lastname),
    }

    // Terminate if no changes made to profile
    if (!this.newChanges(this.userProfile, payload)) {
      this.sendNotification('info', '', 'No changes on profile to be made', this.colorCodes.info);

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
      return;
    }

    this.authService.updateProfile(payload, this.userProfile?._id).subscribe(
      (res) => {
        this.sendNotification('success', 'Success', 'Profile updated successfully', this.colorCodes.success);
        const action = {
          userId: this.userProfile?._id,
          action: "Updated your profile"
        }
        this.userService.saveUserLogs(action).subscribe((result) => {});
        this.isLoading = false;
        this.userService.getUserById(this.userProfile?._id).subscribe((res) => {
          const user = { ...res?.data, token: this.userProfile?.token }
          this.storageService.saveUser(user);
          this.updateCompleted.emit(true);
        });
      },
      (err) => {
        this.sendNotification(
          'warning',
          'Profile Update Failed',
          err.error.message ? err.error.message : 'Something went wrong. Please check your connection.',
          this.colorCodes.error,
        );
        this.isLoading = false;
      },
    );
  }

  // Find out if new changes on profile have been made on the form
  newChanges(oldProfile: any, newProfile: any) {
    if (
      oldProfile?.firstname !== newProfile?.firstname ||
      oldProfile?.lastname !== newProfile?.lastname
    ) {
      return true;
    }
    return false;
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

  formatName(name: string) {
    return this.titleCase(name)
  }

  titleCase(str: string) {
    return str?.toLowerCase()?.replace(/\b\S/g, function (t) { return t?.toUpperCase() });
  }

}
