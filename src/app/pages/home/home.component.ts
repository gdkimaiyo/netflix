import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
// import { UserService } from 'src/app/shared/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { MONTHS, NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;
  isFetchingMovies: boolean = false;
  isFetchingShows: boolean = false;
  size: NzButtonSize = 'large';
  page: number = 1; // Movies page number. Default page 1 out of 500
  randomMovie: any = {};
  popularMovies: any;
  popularShows: any;
  imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";
  // imageURL: string = "assets/images/dave-hoefler-lsoogGC_5dg-unsplash.jpg";

  progressFormart = (percent: number): string => `${percent}%`;

  colorCodes = NOTIFICATION_CODES;

  constructor(
    private router: Router,
    // private userService: UserService,
    private moviesService: MoviesService,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.getAllMovies();
    this.getPopularMovies();
    this.getPopularShows();
    
    // this.userService.getUsers().subscribe((res) => {
    //   console.log("ALL USERS");
    //   console.log(res.data);
    // });
  }

  getAllMovies(): void {
    this.isLoading = true;
    this.page = this.randomNumber(1, 100); // Get random page from 1 to 500

    this.moviesService.getMovies(this.page).subscribe((res) => {
      const randomMovieIndex = this.randomNumber(0, 19);
      this.getMovie(res.results[randomMovieIndex].id);
    },error => {
      this.sendNotification(
        'warning',
        'Error',
        error.error.message ? error.error.message : 'An error occured while fetching movies',
        this.colorCodes.warning,
      );
      this.isLoading = false;
    });
  }

  getMovie(id: number) {
    this.moviesService.getMovieById(id).subscribe((res) => {
      this.randomMovie = res;
      if (this.randomMovie?.poster_path) {
        this.imageURL = `https://image.tmdb.org/t/p/original${this.randomMovie.poster_path}`;
      } else {
        this.sendNotification('warning', '', 'Unable to load movie image', this.colorCodes.warning);
      }
      this.randomMovie.vote_average = this.randomMovie?.vote_average ? Math.round(this.randomMovie?.vote_average * 10) : 0;
      this.isLoading = false;
    },error => {
      this.sendNotification(
        'warning',
        'Error',
        error.error.message ? error.error.message : 'An error occured while fetching random movie',
        this.colorCodes.warning,
      );
      this.isLoading = false;
    });
  }

  showMovieDetails() {
    if (this.randomMovie?.id) {
      this.router.navigateByUrl(`movie/${this.randomMovie?.id}`);
    }
  }

  getPopularMovies(): void {
    this.isFetchingMovies = true;
    this.moviesService.getMovies(1).subscribe((res) => {
      // Populate movie image URL/src and Format date
      res?.results?.forEach((element: any) => {
        element.vote_average = element?.vote_average ? Math.round(element?.vote_average * 10) : 0;
        element.release_date = this.formartDate(element?.release_date);
        element.poster_path = element?.poster_path !== null ?
          `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;
      });
      this.popularMovies = { data: res?.results, title: "Popular Movies" };
      this.isFetchingMovies = false;
    },
    (error) => {
      this.sendNotification(
        'warning',
        'Error',
        error.error.message ? error.error.message : 'An error occured while fetching popular movies',
        this.colorCodes.warning,
      );
      this.isFetchingMovies = false;
    });
  }

  getPopularShows(): void {
    this.isFetchingShows = true;
    this.moviesService.getShows(1).subscribe((res) => {
      // Populate show image URL/src
      res?.results?.forEach((element: any) => {
        element.title = element?.name;
        element.vote_average = element?.vote_average ? Math.round(element?.vote_average * 10) : 0;
        element.release_date = this.formartDate(element?.first_air_date);
        element.poster_path = element?.poster_path !== null ?
          `https://image.tmdb.org/t/p/original${element.poster_path}` : this.imageURL;
      });
      this.popularShows = { data: res?.results, title: "Popular TV Shows" };
      this.isFetchingShows = false;
    },
    (error) => {
      this.sendNotification(
        'warning',
        'Error',
        error.error.message ? error.error.message : 'An error occured while fetching popular tv shows',
        this.colorCodes.warning,
      );
      this.isFetchingShows = false;
    });
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

  // HELPER FUNCTIONS
  randomNumber(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  formartDate(date: string) {
    if (date?.length > 0) {
      let splits = date.split("-");
      if (splits?.length > 1) {
        let year = splits[0], month = MONTHS[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
        return `${month} ${day}, ${year}`;
      }
    }
    return "January, 2001"; // Fallback date
  }
}
