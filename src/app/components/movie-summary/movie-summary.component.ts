import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-movie-summary',
  templateUrl: './movie-summary.component.html',
  styleUrls: ['./movie-summary.component.scss']
})
export class MovieSummaryComponent implements OnInit {
  $Handset: boolean = false;
  rated: any;
  colorCodes = NOTIFICATION_CODES;
  progressFormart = (percent: number): string => `${percent}%`;

  loadMore: boolean = false;
  isFavourite: boolean = false;

  @Input('selectedMovie') selectedMovie: any;
  @Input('moreDetails') moreDetails: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    // Change Modal Width to 100% on mobile.
    this.breakpointObserver.observe(['(min-width: 575px)']).subscribe((state: BreakpointState) => {
      this.$Handset = (state.matches) ? false : true;
    });
    this.rated = this.moreDetails?.Rated;
    this.isFavourite = this.getFavouriteState(this.selectedMovie?.id);
  }

  likeMovie(event: any) {
    let movieId = event.currentTarget.id;
    if (!parseInt(movieId)) {
      this.sendNotification('warning', '', 'Unable to add movie to favourites list.', this.colorCodes.warning,);
      return;
    }
    // Local Storage
    if (!this.isFavourite) {
      this.addFavourite();
    } else {
      this.removeFavourite();
    }
    this.ngOnInit();
  }

  getFavouriteState(movieId: number) {
    // Check localStorage if current movie is already in favourites list
    if (localStorage.getItem("movie_favourites") && typeof (Storage) !== undefined) {
      const favourites = JSON.parse(localStorage.getItem("movie_favourites") || '[]');
      return (favourites?.filter((movie: any) => movie?.id === movieId)?.length > 0) ? true : false
    } else {
      return false;
    }
  }

  addFavourite() {
    if (localStorage.getItem("movie_favourites") && typeof (Storage) !== undefined) {
      const favourites = JSON.parse(localStorage.getItem("movie_favourites") || '[]');
      favourites.push(this.selectedMovie);
      localStorage.setItem("movie_favourites", JSON.stringify(favourites));
      this.sendNotification('success', 'Movie added to favourites', '', this.colorCodes.success,);
      this.isFavourite = true;
    } else {
      if (typeof (Storage) !== undefined) {
        const favourites = [];
        favourites.push(this.selectedMovie);
        localStorage.setItem("movie_favourites", JSON.stringify(favourites));
        this.sendNotification('success', 'Movie added to favourites', '', this.colorCodes.success,);
        this.isFavourite = true;
      } else {
        this.sendNotification('warning', '', 'Unable to add movie to favourites list.', this.colorCodes.warning,);
      }
    }
  }
  removeFavourite() {
    let favourites = JSON.parse(localStorage.getItem("movie_favourites") || '[]');
    favourites = favourites?.filter((movie:any) => movie?.id !== this.selectedMovie?.id)
    localStorage.setItem("movie_favourites", JSON.stringify(favourites));
    this.sendNotification('success', 'Movie removed from favourites', '', this.colorCodes.success,);
    this.isFavourite = false;
  }

  showMore(): void {
    this.loadMore = !this.loadMore;
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
