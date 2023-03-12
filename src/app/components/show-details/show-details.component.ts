import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Location } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/shared/services/user.service';
import { MoviesService } from 'src/app/shared/services/movies.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MONTHS, MONTHS_SHORT, NOTIFICATION_CODES } from '../../utils/constants';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss']
})
export class ShowDetailsComponent implements OnInit {
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  isProcessing: boolean = false;
  $Handset: boolean = false;
  displayBackdrop: boolean = false;
  backdropAvailable: boolean = false;
  idIsInvalid: boolean = false;
  isFavourite: boolean = false;
  loadMore: boolean = false;
  size: NzButtonSize = 'large';
  selectedShow: any;
  backdropURL: string = "assets/images/dave-hoefler-lsoogGC_5dg-unsplash.jpg";
  imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";
  logoURL = "https://image.tmdb.org/t/p/original";

  recommendShows: any = [];
  progressFormart = (percent: number): string => `${percent}%`;
  
  colorCodes = NOTIFICATION_CODES;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private moviesService: MoviesService,
    private storageService: StorageService,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isProcessing = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // const id = 60574 // Peaky Blinders
    // const id = 52814 // Halo
    // const id = 60735 // The Flash
    // const id = 71712 // The Good Doctor

    // Change Modal Width to 100% on mobile.
    this.breakpointObserver.observe(['(min-width: 575px)']).subscribe((state: BreakpointState) => {
      this.$Handset = (state.matches) ? false : true;
    });
    this.isAuthenticated = this.storageService.isLoggedIn() ? true : false;
    
    if (id) {
      this.getShowById(id);
       this.getFavouriteState(id);
      // Get Movie Recommendations
      this.getRecommendations(id);
    } else {
      this.sendNotification('error', '','Error. unable to retrieve show details.',this.colorCodes.error,);
      this.isLoading = false;
      this.idIsInvalid = true;
      this.isProcessing = false;
    }
  }

  getShowById(id: number) {
    this.moviesService.getShowById(id).subscribe((res) => {
      this.selectedShow = res;
      if (this.selectedShow?.backdrop_path) {
        this.backdropURL = `https://image.tmdb.org/t/p/original${this.selectedShow.backdrop_path}`;
        this.backdropAvailable = true;
      } else {
        this.backdropAvailable = false;
      }
      if (this.selectedShow?.poster_path) {
        this.imageURL = `https://image.tmdb.org/t/p/original${this.selectedShow.poster_path}`;
      } else {
        this.sendNotification('warning', '', 'Unable to load show image', this.colorCodes.warning);
      }
      this.selectedShow?.production_companies?.forEach((element: any) => {
        if (element.logo_path) {
          element.logo_path = `${this.logoURL}${element.logo_path}`;
        }
      });
      let runtime = 45; // Let each episode runtime to be 45mins by default
      if (this.selectedShow?.episode_run_time?.length > 0) {
        runtime = Math.max(...this.selectedShow.episode_run_time); // Maximum episode runtime
      }
      if (this.selectedShow?.first_air_date?.length > 0) {
        let splits = this.selectedShow.first_air_date.split("-");
        let year = splits[0], month = MONTHS[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
        this.selectedShow.first_air_date = `${month} ${day}, ${year}`;
      }
      this.selectedShow.runtime = this.formatRuntime(runtime);
      this.selectedShow.vote_average = this.selectedShow?.vote_average ? Math.round(this.selectedShow?.vote_average * 10) : 0;
      this.isLoading = false;
    }, error => {
      this.sendNotification('warning', '',
        error.error.message ? error.error.message : 'Error. TV Show not found.',
        this.colorCodes.warning,
      );
      this.isLoading = false;
      this.idIsInvalid = true;
    });
  }

  likeShow(event: any) {
    let showId = event.currentTarget.id;
    if (!parseInt(showId)) {
      this.sendNotification('warning', '', 'Unable to add show to favourites list.', this.colorCodes.warning,);
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

  getFavouriteState(showId: number) {
    this.moviesService.getFavShowById(showId).subscribe((res) => {
      this.isFavourite = (res?.data) ? true : false;
    }, (err) => {
      console.log(err);
    });
  }

  addFavourite() {
    const { name, overview, poster_path, first_air_date, id } = this.selectedShow;
    const payload = { name, overview, poster_path, first_air_date, id };
    this.moviesService.addFavShow(payload).subscribe((res) => {
      this.sendNotification('success', '', 'TV Show successfully added to your favourites list', this.colorCodes.success);
      const userProfile = this.storageService.getUser();
      const action = {
        userId: userProfile?._id,
        action: `Added the tv show: '${payload.name}' to your favourites list`,
      };
      this.userService.saveUserLogs(action).subscribe((result) => {});
      this.isFavourite = true;
    }, (err) => {
      this.sendNotification(
        'warning', '', 
        'Unable to add show to favourites list. Check your network connection',
        this.colorCodes.warning,
      );
    });
  }

  removeFavourite() {
    const { name, overview, poster_path, first_air_date, id } = this.selectedShow;
    const payload = { name, overview, poster_path, first_air_date, id };
    this.moviesService.removeFavShow(payload?.id, payload).subscribe((res) => {
      this.sendNotification('info', `TV Show successfully removed from your favourites`, '', this.colorCodes.info);
      const userProfile = this.storageService.getUser();
      const action = {
        userId: userProfile?._id,
        action: `Removed the show: '${payload.name}' from your favourites list`,
      };
      this.userService.saveUserLogs(action).subscribe((result) => {});
      this.isFavourite = false;
    }, (err) => {
      this.sendNotification(
        'warning', 'Failed!', 
        'Unable to remove the show from favourites list. Check your network connection',
        this.colorCodes.warning,
      );
    });
  }

  getRecommendations(id: number): void {
    this.moviesService.getShowRecommendations(id).subscribe((res) => {
      this.recommendShows = res.results;
      this.recommendShows.forEach((show: any) => {
        show.poster_path = show?.poster_path ? `${this.logoURL}${show?.poster_path}` : this.imageURL;
        show.vote_average = show?.vote_average ? Math.round(show?.vote_average * 10) : 0;
        if (show?.first_air_date?.length > 0) {
          let splits = show.first_air_date.split("-");
          let year = splits[0], month = MONTHS_SHORT[parseInt(splits[1]) - 1], day = parseInt(splits[2]);
          show.first_air_date = `${month} ${day}, ${year}`;
        }
      });
      this.isProcessing = false;
    }, error => {
      this.sendNotification('warning', '',
        error.error.message ? error.error.message : 'Error. Show recommendations not found.',
        this.colorCodes.warning,
      );
      this.isProcessing = false;
    });
  }

  showTvDetails(event: any) {
    let showId = event.currentTarget.id;
    this.router.navigate([`show/${showId}`]).then(() => {
      window.location.reload();
    });
  }

  login(): void {
    this.router.navigate(['login']);
  }
  
  showBackdrop():void {
    this.displayBackdrop = !this.displayBackdrop;
    window.scrollTo(0,0);
  }

  goBack(): void {
    this.location.back();
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
