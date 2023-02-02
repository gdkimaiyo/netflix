import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { FAQS } from '../../utils/constants';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  size: NzButtonSize = 'large';

  faqs = FAQS;
  constructor() { }

  ngOnInit(): void {
  }

}
