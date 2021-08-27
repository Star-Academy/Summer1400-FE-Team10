import {Component} from '@angular/core';
import {StorageServiceService} from './services/storage-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Summer1400-FE-Team10';
  constructor(private storage: StorageServiceService) {}

  ngOnInit(): void {
    //console.log(this.storage.user_info.get());
  }
}
