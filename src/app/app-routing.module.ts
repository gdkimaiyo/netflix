import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'show/:id', component: ShowDetailsComponent },
  { path: 'profile/favourites', component: FavouritesComponent },
  { path: '**', component: NotFoundComponent }, // 404 - Not Found page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
