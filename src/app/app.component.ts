import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mini-Netflix';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem("nflix_user") || '[]');
    if (user && user?.length !== 0) {
      this.authService.verifyUser({ token: user?.token, userId: user?._id })
      .subscribe((res) => {
        if (res?.data !== true) {
          localStorage.removeItem("nflix_user");
        }
      },
      (error) => {
        localStorage.removeItem("nflix_user");
      });
    }
  }
}
