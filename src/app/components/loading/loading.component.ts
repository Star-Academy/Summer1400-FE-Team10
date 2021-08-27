import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  constructor() {}

  @Input() type: string = 'normal';
  @Input() hasText: boolean = false;

  ngOnInit(): void {}
}
