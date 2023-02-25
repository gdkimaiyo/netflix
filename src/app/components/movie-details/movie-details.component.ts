import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { MONTHS_SHORT, NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  isLoading: boolean = false;
  isProcessing: boolean = false;
  showBackdrop: boolean = false;
  backdropAvailable: boolean = false;
  idIsInvalid: boolean = false;
  size: NzButtonSize = 'large';
  page: number = 1; // Movies page number. Default page 1 out of 500
  selectedMovie: any;
  moreDetails: any; // More Movie Details form OMDb API
  backdropURL: string = "assets/images/dave-hoefler-lsoogGC_5dg-unsplash.jpg";
  imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";
  logoURL = "https://image.tmdb.org/t/p/original";

  recommendMovies: any = [];
  progressFormart = (percent: number): string => `${percent}%`;

  colorCodes = NOTIFICATION_CODES;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isProcessing = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // const id = 547016; // The Old Guard. A Netflix movie
    // const id = 824920; // No rating, release date, runtime, rated
    // const id = 683641; // A Netflix movie
    // const id = 730629; // No rating, release date, runtime, rated
    // const id = 2899; // Cleopatra. A lot of production companies. Use show all button to show others, but show only top 3
    // const id = 51739; // The Secret World of Arrietty. Desney Movie
    // const id = 768744; // No Awards
    if (id) {
      this.getMovie(id);
      // Get Movie Recommendations
      this.getRecommendations(id);
    } else {
      this.sendNotification('warning', '',
        'Error. Movie not found. Invalid movie Id',
        this.colorCodes.warning,
      );
      this.isLoading = false;
      this.idIsInvalid = true;
      this.isProcessing = false;
    }
  }

  getMovie(id: number) {
    this.moviesService.getMovieById(id).subscribe((res) => {
      this.selectedMovie = res;
      if (this.selectedMovie?.backdrop_path) {
        this.backdropURL = `https://image.tmdb.org/t/p/original${this.selectedMovie.backdrop_path}`;
        this.backdropAvailable = true;
      } else {
        this.backdropAvailable = false;
      }
      if (this.selectedMovie?.poster_path) {
        this.imageURL = `https://image.tmdb.org/t/p/original${this.selectedMovie.poster_path}`;
      } else {
        this.sendNotification('warning', '', 'Unable to load movie image', this.colorCodes.warning);
      }
      this.selectedMovie?.production_companies?.forEach((element: any) => {
        if (element.logo_path) {
          element.logo_path = `${this.logoURL}${element.logo_path}`;
        }
      });
      this.selectedMovie.runtime = this.selectedMovie?.runtime ? this.formatRuntime(this.selectedMovie?.runtime) : '0';
      this.selectedMovie.budget = this.selectedMovie?.budget ? this.formatCurrency(this.selectedMovie?.budget) : '$0';
      this.selectedMovie.vote_average = this.selectedMovie?.vote_average ? Math.round(this.selectedMovie?.vote_average * 10) : 0;
      this.getMoreDetails(this.selectedMovie?.imdb_id);
    }, error => {
      this.sendNotification('warning', '',
        error.error.message ? error.error.message : 'Error. Movie not found.',
        this.colorCodes.warning,
      );
      this.isLoading = false;
      this.idIsInvalid = true;
    });
  }

  getMoreDetails(id: string) {
    this.moviesService.getOMDb(id).subscribe((res) => {
      this.moreDetails = res;
      this.isLoading = false;
    }, error => {
      this.sendNotification('error', '',
        error.error.message ? error.error.message : 'Error. unable to retrieve more movie details.',
        this.colorCodes.error,
      );
      this.isLoading = false;
    });
  }

  getRecommendations(id: number): void {
    this.moviesService.getMovieRecommendations(id).subscribe((res) => {
      this.recommendMovies = res.results;
      this.recommendMovies.forEach((movie: any) => {
        movie.poster_path = movie?.poster_path ? `${this.logoURL}${movie?.poster_path}` : this.imageURL;
        movie.vote_average = movie?.vote_average ? Math.round(movie?.vote_average * 10) : 0;
        if (movie?.release_date?.length > 0) {
          let splits = movie.release_date.split("-");
          let year = splits[0], month = MONTHS_SHORT[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
          movie.release_date = `${month} ${day}, ${year}`;
        }
      });
      // this.recommendMovies.sort((a: any, b: any) => a.vote_average > b.vote_average ? -1 : 1);
      this.isProcessing = false;
    }, error => {
      this.sendNotification('warning', '',
        error.error.message ? error.error.message : 'Error. Movie Recommendations not found.',
        this.colorCodes.warning,
      );
      this.isProcessing = false;
    });
  }

  showMovieDetails(event: any) {
    let movieId = event.currentTarget.id;
    this.router.navigate([`movie/${movieId}`]).then(() => {
      window.location.reload();
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

  showMovieBackdrop():void {
    this.showBackdrop = !this.showBackdrop;
    window.scrollTo(0,0);
  }

  goBack(): void {
    this.location.back();
  }

  // HELPER FUNCTIONS
  formatRuntime(mins: number) {
    let hrs = Math.floor(mins / 60);
    let min = Math.floor(mins % 60);
    if (min == 0) {
      return `${hrs}h`;
    } else if(hrs == 0 && min > 0) {
      return `${min}m`;
    } else {
      return `${hrs}h ${min}m`;
    }
  }
  formatCurrency(amount: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(amount);
  }
}
