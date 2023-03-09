import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MONTHS, NOTIFICATION_CODES, FETCH_NEXT_PAGE_ITEMS } from '../../utils/constants';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  position: NzTabPosition = 'top';
  colorCodes = NOTIFICATION_CODES;
  loading: boolean = false;
  favMovies: any;
  movies: any;
  favShows: any;
  shows: any;
  imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";

  totalMovies: number = 50; // By default favourites movies will be 50 in total
  totalShows: number = 50; // By default favourites shows will be 50 in total
  perPage: number = 10; // Show 10 favourites per page
  page: number = 1; // Show first page of the favourites

  constructor(
    private router: Router,
    private location: Location,
    private storageService: StorageService,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.loading = true;
    this.page = 1;
    this.favMovies = this.getFavourites("movies");
    this.totalMovies = (Math.ceil(this.favMovies.length / 10)) * 10;
    this.movies = FETCH_NEXT_PAGE_ITEMS(this.favMovies, this.page, this.perPage);
    // Populate movie image URL/src and Format date
    this.favMovies.forEach((element: any) => {
      element.imageURL = element?.poster_path !== null ?
        `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;

      if (element?.release_date?.length > 0) {
        let splits = element.release_date.split("-");
        let year = splits[0], month = MONTHS[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
        element.release_date = `${month} ${day}, ${year}`;
      }
    });

    this.favShows = this.getFavourites("shows");;
    this.totalShows = (Math.ceil(this.favShows.length / 10)) * 10;
    this.shows = FETCH_NEXT_PAGE_ITEMS(this.favShows, this.page, this.perPage);
    // Populate movie image URL/src
    this.favShows.forEach((element: any) => {
      element.imageURL = element?.poster_path !== null ?
        `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;
    });

    this.loading = false;
  }

  getFavourites(category: string) {
    if (category === "movies") {
      if (localStorage.getItem("movie_favourites") && typeof (Storage) !== undefined) {
        return JSON.parse(localStorage.getItem("movie_favourites") || '[]');
      } else {
        return [];
      }
    } else {
      if (localStorage.getItem("show_favourites") && typeof (Storage) !== undefined) {
        return JSON.parse(localStorage.getItem("show_favourites") || '[]');
      } else {
        return [];
      }
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

  showShowDetails(event: any) {
    let showId = event.currentTarget.id;
    if (parseInt(showId)) {
      this.router.navigateByUrl(`show/${showId}`);
    }
  }

  removeMovie(movieId: number, category: string) {
    // Remove movie from favourites
    if (category === "Movie") {
      let favourites = JSON.parse(localStorage.getItem("movie_favourites") || '[]');
      favourites = favourites?.filter((movie:any) => movie?.id !== movieId);
      localStorage.setItem("movie_favourites", JSON.stringify(favourites));
    } else {
      let favourites = JSON.parse(localStorage.getItem("show_favourites") || '[]');
      favourites = favourites?.filter((show:any) => show?.id !== movieId);
      localStorage.setItem("show_favourites", JSON.stringify(favourites));
    }

    this.sendNotification('success', `${category} removed from favourites`, '', this.colorCodes.success,);
    this.ngOnInit();
  }

  changePage(pg: number, category: string): void {
    if (category === "movies") {
      this.movies = FETCH_NEXT_PAGE_ITEMS(this.favMovies, pg, this.perPage);
    } else {
      this.shows = FETCH_NEXT_PAGE_ITEMS(this.favShows, pg, this.perPage);
    }

    window.scrollTo(0,0);
    this.page = pg;
  }

  tabClicked() {
    this.page = 1;
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
