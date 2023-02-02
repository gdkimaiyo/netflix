import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MONTHS, NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  colorCodes = NOTIFICATION_CODES;
  loading: boolean = false;
  favourites: any;
  movies: any;
  imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";

  totalMovies: number = 50; // By default favourites movies will be 50 in total 
  perPage: number = 10; // Show 10 favourites per page
  page: number = 1; // Show first page of the favourites

  constructor(
    private router: Router,
    private location: Location,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.favourites = this.getFavourites();
    this.totalMovies = (Math.ceil(this.favourites.length / 10)) * 10;
    this.movies = this.fetchNextPageMovies(this.favourites, this.page, this.perPage);
    // Populate movie image URL/src and Format date
    this.favourites.forEach((element: any) => {
      element.imageURL = element?.poster_path !== null ?
        `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;

      if (element?.release_date?.length > 0) {
        let splits = element.release_date.split("-");
        let year = splits[0], month = MONTHS[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
        element.release_date = `${month} ${day}, ${year}`;
      }
    });
    this.loading = false;
  }

  getFavourites() {
    if (localStorage.getItem("movie_favourites") && typeof (Storage) !== undefined) {
      return JSON.parse(localStorage.getItem("movie_favourites") || '[]');
    }
  }

  goBack(): void {
    this.location.back();
  }

  showMovieDetails(event: any) {
    let movieId = event.currentTarget.id;
    if (parseInt(movieId)) {
      this.router.navigateByUrl(`movie/${movieId}`);
    }
  }

  removeMovie(movieId: number) {
    // Remove movie from favourites
    let favourites = JSON.parse(localStorage.getItem("movie_favourites") || '[]');
    favourites = favourites?.filter((movie:any) => movie?.id !== movieId);
    localStorage.setItem("movie_favourites", JSON.stringify(favourites));
    this.sendNotification('success', 'Movie removed from favourites', '', this.colorCodes.success,);
    this.ngOnInit();
  }

  changePage(pg: number): void {
    this.movies = this.fetchNextPageMovies(this.favourites, pg, this.perPage);
    window.scrollTo(0,0);
    this.page = pg;
  }

  fetchNextPageMovies(movies: any, page: number, perPage: number) {
    if (movies?.length > 0) {
      if (page == 1) {
        if ((page*perPage) <= movies.length) {
          return movies.slice(page-1, (page*perPage));
        } else {
          return movies.slice(page-1, movies.length);
        }
      } else {
        if ((page*perPage) <= movies.length) {
          return movies.slice((page*perPage) - perPage, (page*perPage));
        } else {
          return movies.slice((page*perPage) - perPage, movies.length);
        }
      }
    } else {
      return [];
    }
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
