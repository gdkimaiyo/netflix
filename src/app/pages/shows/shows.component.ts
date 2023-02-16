import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MONTHS_SHORT, NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss']
})
export class ShowsComponent implements OnInit {
  colorCodes = NOTIFICATION_CODES;
  isLoading: boolean = false;
  inProgress: boolean = false;

  imageURL: string = "assets/images/dave-hoefler-lsoogGC_5dg-unsplash.jpg";
  tmdb: string = "https://image.tmdb.org/t/p/original";
  progressFormart = (percent: number): string => `${percent}%`;

  // All SHOWS - 20 per page
  shows: any = [];
  totalShows: number = 5000; // By default shows will be 5000 in total
  page: number = 1; // Shows page number. 1 out of 500. Default page => 1

  form!: FormGroup;
  searchTitle: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private moviesService: MoviesService,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.form = this.fb.group({
      searchTerm: [null, [Validators.required]],
    });

    this.totalShows = 5000;
    this.page = this.getPageNumber();
    this.fetchShows(this.page);
  }

  fetchShows(page: number) {
    this.moviesService.getShows(page).subscribe((res) => {
      this.shows = res.results;
      this.shows.forEach((show: any) => {
        show.poster_path = show?.poster_path ? `${this.tmdb}${show?.poster_path}` : this.imageURL;
        show.vote_average = show?.vote_average ? Math.round(show?.vote_average * 10) : 0;
        if (show?.first_air_date?.length > 0) {
          let splits = show.first_air_date.split("-");
          let year = splits[0], month = MONTHS_SHORT[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
          show.first_air_date = `${month} ${day}, ${year}`;
        }
      });
      this.isLoading = false;
    },error => {
      this.sendNotification(
        'warning',
        'Error',
        error.error.message ? error.error.message : 'An error occured while fetching TV Shows',
        this.colorCodes.warning,
      );
      this.isLoading = false;
    });
  }

  startSearch(): void {
    if (this.form.valid) {
      this.inProgress = true;
      this.searchTitle = this.form.value.searchTerm;
      this.getTvShowByTitle(1, this.searchTitle);
      this.page = 1;
    } else {
      this.searchTitle = undefined;
      this.ngOnInit();
    }
  }

  getTvShowByTitle(page: number, title: string): void {
    this.moviesService.getTvShowByTitle(page, title).subscribe((res) => {
      this.totalShows = (Math.ceil(res.total_results / 20)) * 10;
      this.shows = res.results;
      this.shows.forEach((show: any) => {
        show.poster_path = show?.poster_path ? `${this.tmdb}${show?.poster_path}` : this.imageURL;
        show.vote_average = show?.vote_average ? Math.round(show?.vote_average * 10) : 0;
        if (show?.first_air_date?.length > 0) {
          let splits = show.first_air_date.split("-");
          let year = splits[0], month = MONTHS_SHORT[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
          show.first_air_date = `${month} ${day}, ${year}`;
        }
      });
      
      this.inProgress = false;
    },error => {
      this.sendNotification(
        'warning',
        'Error',
        error.error.message ? error.error.message : 'An error occured while searching for the TV show',
        this.colorCodes.warning,
      );
      this.inProgress = false;
    });
  }

  showTvDetails(event: any) {
    let showId = event.currentTarget.id;
    this.router.navigateByUrl(`show/${showId}`);
  }

  changePage(pg: number): void {
    if (this.searchTitle) {
      this.inProgress = true;
      this.getTvShowByTitle(pg, this.searchTitle);
    } else {
      this.isLoading = true;
      this.fetchShows(pg);
      this.savePageNumber(pg);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.page = pg;
  }

  getPageNumber() { // Get page number from local storage
    if (typeof (Storage) !== undefined && localStorage.getItem("shows_page")) {
      return JSON.parse(localStorage.getItem("shows_page") || '1');
    } else {
      return 1;
    }
  }

  savePageNumber(page: number): void { // Save page number to local storage
    if (typeof (Storage) !== undefined) {
      localStorage.setItem("shows_page", JSON.stringify(page));
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
