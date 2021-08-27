import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss'],
})
export class PageSectionComponent implements OnInit {
  @Input() title?: string;
  @Input() description?: string;
  @Input() hasFooter?: boolean = true;
  @Input() alternate?: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
