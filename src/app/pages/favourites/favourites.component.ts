import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { UserService } from 'src/app/shared/services/user.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { MONTHS, NOTIFICATION_CODES, FETCH_NEXT_PAGE_ITEMS } from '../../utils/constants';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  position: NzTabPosition = 'top';
  colorCodes = NOTIFICATION_CODES;
  loading: boolean = false; // Loading movies
  isLoading: boolean = false; // Loading shows
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
    private userService: UserService,
    private moviesService: MoviesService,
    private storageService: StorageService,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.loading = true;
    this.isLoading = true;
    this.page = 1;
    this.favMovies = this.getLocalFavMovies();
    this.totalMovies = (Math.ceil(this.favMovies.length / 10)) * 10;
    this.movies = FETCH_NEXT_PAGE_ITEMS(this.favMovies, this.page, this.perPage);
    // Populate movie image URL/src and Format date
    this.favMovies.forEach((element: any) => {
      element.imageURL = element?.poster_path !== null ?
        `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;

      if (element?.release_date?.length > 0) {
        let splits = element.release_date.split("-");
        if (splits?.length > 1) {
          let year = splits[0], month = MONTHS[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
          element.release_date = `${month} ${day}, ${year}`;
        }
      }
    });

    this.getRemoteFavMovies(); // Get User Favourites from db
    this.getFavouriteShows();
  }

  getLocalFavMovies() {
    if (localStorage.getItem("movie_favourites") && typeof (Storage) !== undefined) {
      return JSON.parse(localStorage.getItem("movie_favourites") || '[]');
    }
    return [];
  }

  getRemoteFavMovies() {
    this.moviesService.getFavMovies().subscribe(
      (res) => {
        let toSave: any = [];
        if (res?.data?.length === 0) {
          toSave = this.favMovies;
        } else {
          if (this.favMovies?.length === 0) {
            localStorage.removeItem("movie_favourites");
            let favourites: any = [];
            res?.data?.forEach((element: any) => {
              favourites.push(element);
              localStorage.setItem("movie_favourites", JSON.stringify(favourites));
            });
          } else {
            this.favMovies?.forEach((movie: any) => {
              let isFav = res?.data?.filter((elm: any) => elm?.id === movie?.id);
              if (isFav?.length === 0) {
                toSave.push(movie);
              }
            });
          }
        }
        toSave?.forEach((movie: any) => {
          const { title, overview, poster_path, release_date, id } = movie;
          const payload = { title, overview, poster_path, release_date, id };
          this.moviesService.addFavMovie(payload).subscribe((res) => {
            const userProfile = this.storageService.getUser();
            const action = {
              userId: userProfile?._id,
              action: `Added the movie: '${payload.title}' to your favourites list`,
            };
            this.userService.saveUserLogs(action).subscribe((result) => {});
          });
        });
        this.loading = false;
      },
      (err) => {
        this.sendNotification('warning', '', 'Unable to fetch your movie favourites. Check your network connection', this.colorCodes.warning);
        this.loading = false;
      },
    );
  }

  getFavouriteShows() {
    this.moviesService.getFavShows().subscribe(
      (res) => {
        this.favShows = res?.data;
        this.totalShows = (Math.ceil(this.favShows.length / 10)) * 10;
        this.shows = FETCH_NEXT_PAGE_ITEMS(this.favShows, this.page, this.perPage);
        // Populate movie image URL/src
        this.favShows.forEach((element: any) => {
          element.imageURL = element?.poster_path !== null ?
            `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;
        });
        this.isLoading = false;
      },
      (err) => {
        this.sendNotification('warning', '', 'Unable to fetch your tv show favourites. Check your network connection', this.colorCodes.warning);
        this.isLoading = false;
      },
    );
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

      const toRemove = this.favMovies?.filter((movie: any) => movie?.id === movieId);
      const { title, overview, poster_path, release_date, id } = toRemove[0];
      const payload = { title, overview, poster_path, release_date, id };
      this.moviesService.removeFavMovie(payload?.id, payload).subscribe((res) => {
        const userProfile = this.storageService.getUser();
        const action = {
          userId: userProfile?._id,
          action: `Removed the movie: '${payload.title}' from your favourites list`,
        };
        this.userService.saveUserLogs(action).subscribe((result) => {});
      });
    } else {
      const toRemove = this.favShows?.filter((show: any) => show?.id === movieId);
      const { name, overview, poster_path, first_air_date, id } = toRemove[0];
      const payload = { name, overview, poster_path, first_air_date, id };
      this.moviesService.removeFavShow(payload?.id, payload).subscribe((res) => {
        const userProfile = this.storageService.getUser();
        const action = {
          userId: userProfile?._id,
          action: `Removed the show: '${payload.name}' from your favourites list`,
        };
        this.userService.saveUserLogs(action).subscribe((result) => {});
      });
    }

    this.sendNotification('info', `${category} successfully removed from favourites`, '', this.colorCodes.info);
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
