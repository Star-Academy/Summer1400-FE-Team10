import {Component, Input, OnInit} from '@angular/core';
import {SongListItemServiceService} from './song-list-item-service.service';

@Component({
  selector: 'song-list-item',
  templateUrl: './song-list-item.component.html',
  styleUrls: ['./song-list-item.component.scss'],
})
export class SongListItemComponent implements OnInit {
  @Input() data!: any;
  isImageLoaded: boolean = false;
  isPlaceholderHidden: boolean = false;

  @Input() liked: boolean = true;
  @Input() likeDisabled: boolean = true;

  constructor(private songService: SongListItemServiceService) {}

  ngOnInit(): void {}

  imageLoaded() {
    this.isImageLoaded = true;
    setTimeout(() => {
      this.isPlaceholderHidden = true;
    }, 310);
  }

  like() {
    if (this.likeDisabled) return;
    if (this.liked) {
      this.likeDisabled = true;
      this.songService.dislike('', 0, this.data.id).subscribe(() => {
        this.liked = false;
        this.likeDisabled = false;
      });
    } else {
      this.likeDisabled = true;
      this.songService.like('', 0, this.data.id).subscribe(() => {
        this.liked = true;
        this.likeDisabled = false;
      });
    }
  }
}
