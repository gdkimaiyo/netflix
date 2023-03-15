import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input('popular') popular: any;
  @Input('isLoading') isLoading: boolean | undefined;
  @ViewChild('notifyContent', { static: false }) template?: TemplateRef<{}>;

  progressFormart = (percent: number): string => `${percent}%`;
  imageURL = "https://dummyimage.com/300x300/000/fff&text=Loading+Image+...";
  dummy: any = [];

  constructor(public router: Router) { }

  ngOnInit(): void {
    for (let index = 0; index < 20; index++) {
      this.dummy.push(index);
    }
  }

  showMovieDetails(event: any, category: string) {
    if (category === "Popular Movies") {
      let movieId = event.currentTarget.id;
      this.router.navigate([`movie/${movieId}`]);
    } else {
      let showId = event.currentTarget.id;
      this.router.navigate([`show/${showId}`]);
    }
  }

}
