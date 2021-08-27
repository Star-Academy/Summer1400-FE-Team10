import {Component, OnInit} from '@angular/core';

const objects = [
  {id: 1, name: 'asdvasd'},
  {id: 2, name: 'asdvaw'},
  {id: 3, name: 'av'},
  {id: 4, name: 'assdadv'},
  {id: 5, name: 'asawdv'},
];

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  list = objects;

  constructor() {}

  ngOnInit(): void {}

  selectedItem?: any = null;
  clg(item: {id: number; name: string}): void {
    console.log(item.id, item.name);
    this.selectedItem = item;
  }
}
