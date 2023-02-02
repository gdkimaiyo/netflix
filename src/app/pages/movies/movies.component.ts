import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { MONTHS_SHORT, NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  isLoading: boolean = false;
  inProgress: boolean = false;
  form!: FormGroup;
  searchTitle: any;
  // imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";
  imageURL: string = "assets/images/dave-hoefler-lsoogGC_5dg-unsplash.jpg";
  tmdb: string = "https://image.tmdb.org/t/p/original";
  progressFormart = (percent: number): string => `${percent}%`;

  colorCodes = NOTIFICATION_CODES;

  // All MOVIES - 20 per page
  movies: any = [];
  page: number = 1; // Movies page number. 1 out of 500. Default page => 1

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private moviesService: MoviesService,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.page = this.getPageNumber();
    this.fetchMovies(this.page);

    this.form = this.fb.group({
      searchTerm: [null, [Validators.required]],
    });
  }

  fetchMovies(page: number) {
    this.moviesService.getMovies(page).subscribe((res) => {
      this.movies = res.results;
      this.movies.forEach((movie: any) => {
        movie.poster_path = movie?.poster_path ? `${this.tmdb}${movie?.poster_path}` : this.imageURL;
        movie.vote_average = movie?.vote_average ? movie?.vote_average * 10 : 0;
        if (movie?.release_date?.length > 0) {
          let splits = movie.release_date.split("-");
          let year = splits[0], month = MONTHS_SHORT[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
          movie.release_date = `${month} ${day}, ${year}`;
        }
      });
      this.isLoading = false;
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

  showMovieDetails(event: any) {
    let movieId = event.currentTarget.id;
    this.router.navigateByUrl(`movie/${movieId}`);
  }

  changePage(pg: number): void {
    this.isLoading = true;
    this.fetchMovies(pg);
    window.scrollTo(0,0);
    this.page = pg;
    this.savePageNumber(pg);
  }

  savePageNumber(page: number): void { // Save page number to local storage
    if (typeof (Storage) !== undefined) {
      localStorage.setItem("movie_page", JSON.stringify(page));
    }
  }

  getPageNumber() { // Get page number from local storage
    if (typeof (Storage) !== undefined && localStorage.getItem("movie_page")) {
      return JSON.parse(localStorage.getItem("movie_page") || '1');
    } else {
      return 1;
    }
  }

  startSearch(): void {
    if (this.form.valid) {
      this.inProgress = true;
      this.searchTitle = this.form.value.searchTerm;
      this.moviesService.getMovieByTitle(this.searchTitle).subscribe((res) => {
        this.movies = res;
        this.movies.id = this.movies.imdbID;
        this.movies.title = this.movies?.Title;
        this.movies.release_date = this.movies?.Released;
        this.movies.poster_path = (this.movies?.Poster !== "N/A") ? this.movies?.Poster : this.imageURL;
        this.movies.vote_average = (this.movies?.imdbRating !== "N/A") ? parseFloat(this.movies?.imdbRating) * 10 : 0;
        this.movies = [this.movies];
        this.inProgress = false;
      },error => {
        this.sendNotification(
          'warning',
          'Error',
          error.error.message ? error.error.message : 'An error occured while searching the movie',
          this.colorCodes.warning,
        );
        this.inProgress = false;
      });
    } else {
      this.searchTitle = undefined;
      this.ngOnInit();
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
