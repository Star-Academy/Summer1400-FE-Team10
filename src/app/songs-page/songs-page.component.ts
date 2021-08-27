import {Component, OnInit} from '@angular/core';
import {SongListService} from './song-list.service';

@Component({
  selector: 'app-songs-page',
  templateUrl: './songs-page.component.html',
  styleUrls: ['./songs-page.component.scss'],
})
export class SongsPageComponent implements OnInit {
  constructor(private listService: SongListService) {}

  isLoading: boolean = true;
  list: any[] = [];
  pageSize: number = 20;
  currentPage: number = 1;

  ngOnInit(): void {
    this.setPage(this.pageSize, this.currentPage);
  }

  setPage(size: number, current: number) {
    this.listService.getPage(size, current).subscribe((list) => {
      this.list = list.songs;
      console.log(this.list);
      this.isLoading = false;
    });
  }
}
