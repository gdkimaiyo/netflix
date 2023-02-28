import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faAngleDoubleUp,
  faAngleLeft,
  faAngleRight,
  faBars,
  faCircle,
  faCircleCheck,
  faEye,
  faEyeSlash,
  faFrown,
  faHeart,
  faHome,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMinus,
  faPlay,
  faPlus,
  faSearch,
  faTimes, 
} from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [FooterComponent, NavbarComponent, NotFoundComponent],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzButtonModule,
    NzDividerModule,
    NzDropDownModule,
    NzTypographyModule,
    NzNotificationModule,
    NzFormModule,
    NzInputModule,
    NzCollapseModule,
    NzCardModule,
    NzAvatarModule,
    NzSpinModule,
    NzBackTopModule,
    NzProgressModule,
    NzPaginationModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzTabsModule,
    FontAwesomeModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    NotFoundComponent,
    NzLayoutModule,
    NzButtonModule,
    NzDividerModule,
    NzDropDownModule,
    NzTypographyModule,
    NzNotificationModule,
    NzFormModule,
    NzInputModule,
    NzCardModule,
    NzCollapseModule,
    NzAvatarModule,
    NzSpinModule,
    NzBackTopModule,
    NzProgressModule,
    NzPaginationModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzTabsModule,
    FontAwesomeModule,
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faBars,
      faPlus,
      faHome,
      faFrown,
      faMinus,
      faHeart,
      faCircle,
      faLinkedin,
      faGithubSquare,
      faTwitterSquare,
      faLongArrowAltLeft,
      faLongArrowAltRight,
      faAngleDoubleUp,
      faPlay,
      faAngleRight,
      faAngleLeft,
      faTimes,
      faSearch,
      faEye,
      faEyeSlash,
      faCircleCheck,
    );
  }
}
