import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { httpInterceptorProviders } from './shared/helpers/http.interceptor';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieSummaryComponent } from './components/movie-summary/movie-summary.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { LoginComponent } from './pages/login/login.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PreviewComponent } from './components/preview/preview.component';
import { UpdateProfileFormComponent } from './components/update-profile-form/update-profile-form.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FaqsComponent,
    MovieDetailsComponent,
    MovieSummaryComponent,
    FavouritesComponent,
    LoginComponent,
    MoviesComponent,
    ShowsComponent,
    ShowDetailsComponent,
    SignupComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent,
    PreviewComponent,
    UpdateProfileFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    httpInterceptorProviders,
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
