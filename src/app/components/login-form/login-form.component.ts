import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

  form!: FormGroup;
  email: string | null = null;
  password: string | null = null;

  isLoading: boolean = false;
  passwordVisible: boolean = false;

  colorCodes = NOTIFICATION_CODES;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required], [this.emailValidator]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit(form: { email: string; password: string }): void {
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }
    console.log(form);
    // this.submitForm();
  }

  submitForm(): void {
    this.isLoading = true;

    if (!this.form.valid) {
      this.sendNotification('warning', '', 'All input fields are required', this.colorCodes.warning);

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
      return;
    }

    const payload = {
      email: this.form.value.email,
      password: this.form.value.password,
    }
    console.log(payload);

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    return;
  }

  goTo(): void {
    this.router.navigate(['register']);
  }

  // VALIDATORS
  emailValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!control.value) {
          observer.next({ error: true, required: true });
        } else if (control.value && !this.validateEmail(control.value)) {
          observer.next({ invalidEmail: true, error: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

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

  validateEmail(email: any) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

}
