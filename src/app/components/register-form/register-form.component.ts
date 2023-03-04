import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  form!: FormGroup;
  email: string | null = null;
  name: string | null = null;
  password: string | null = null;
  confirmPassword: string | null = null;

  isLoading: boolean = false;
  passwordVisible: boolean = false;
  confirmPassVisible: boolean = false;

  colorCodes = NOTIFICATION_CODES;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required], [this.emailValidator]],
      name: [null, [Validators.required], [this.fullNameValidator]],
      password: [null, [Validators.required], [this.passValidator]],
      confirmPassword: [null, [Validators.required], [this.pass2Validator]],
    });
  }

  onSubmit(form: { email: string; name: string; password: string, confirmPassword: string }): void {
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }
    console.log(form);
    // this.register();
  }

  register(): void {
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
      firstname: this.getName('first', this.form.value.name),
      lastname: this.getName('last', this.form.value.name),
      password: this.form.value.password,
    }

    this.authService.register(payload).subscribe(
      (res) => {
        this.sendNotification('success', 'Success', 'Registration successfull', this.colorCodes.success);
        const action = {
          userId: res?.data?._id,
          action: "Registered for an account"
        }
        this.userService.saveUserLogs(action).subscribe((result) => {});
        this.isLoading = false;
        this.router.navigate(['login']);
      },
      (err) => {
        if (err?.response?.status === 409) {
          this.sendNotification(
            'warning',
            'Registration Failed',
            err.error.message,
            this.colorCodes.error,
          );
        } else {
          this.sendNotification(
            'warning',
            'Registration Failed',
            err.error.message ? err.error.message : 'Something went wrong. Please check your connection.',
            this.colorCodes.error,
          );
        }
        this.isLoading = false;
      },
    );
  }

  goTo(): void {
    this.router.navigate(['login']);
  }

  // VALIDATORS
  fullNameValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!control.value) {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, required: true });
        } else if (control.value && !this.validateFullName(control.value)) {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ missingLastName: true, error: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

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

  passValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!control.value) {
          observer.next({ error: true, required: true });
        } else if (control.value && control.value?.length < 4) {
          observer.next({ invalidPass: true, error: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  pass2Validator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!control.value) {
          observer.next({ error: true, required: true });
        } else if (control.value && control.value !== this.form.value.password) {
          observer.next({ invalidPass2: true, error: true });
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

  validateFullName(name: string) {
    // const re = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const re = /^[a-zA-Z\-\’']+( [a-zA-Z\-\’']+)+$/;
    return re.test(name);
  }

  validateEmail(email: any) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  getName(name: string, fullname: any) {
    if (name === 'first') {
      let arr = fullname.split(" ");
      return this.titleCase(arr[0])
    }
    else {
      let arr = fullname.split(" ");
      return this.titleCase(arr[1])
    }
  }

  titleCase(str: string) {
    return str?.toLowerCase()?.replace(/\b\S/g, function (t) { return t?.toUpperCase() });
  }

}
