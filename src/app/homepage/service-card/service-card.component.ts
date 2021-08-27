import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {scrollListener} from 'src/app/scrollListener/scrollListener';

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent extends scrollListener implements OnInit {
  @Input() icon?: string;
  @Input() title?: string;
  @Input() text?: string;
  @Input() id?: number = 0;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit(): void {}
}
