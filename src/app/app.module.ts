import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';

import {HomepageComponent} from './homepage/homepage.component';
import {MainHeaderComponent} from './main-header/main-header.component';
import {MainFooterComponent} from './main-footer/main-footer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainBannerComponent} from './homepage/main-banner/main-banner.component';
import {PageSectionComponent} from './page-section/page-section.component';
import {ServiceCardComponent} from './homepage/service-card/service-card.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {SignupPageComponent} from './signup-page/signup-page.component';
import {SongsPageComponent} from './songs-page/songs-page.component';
import {SongPageComponent} from './song-page/song-page.component';
import {LoadingComponent} from './components/loading/loading.component';
import {HttpClientModule} from '@angular/common/http';
import { SongListItemComponent } from './songs-page/song-list-item/song-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MainHeaderComponent,
    MainFooterComponent,
    MainBannerComponent,
    PageSectionComponent,
    ServiceCardComponent,
    LoginPageComponent,
    SignupPageComponent,
    SongsPageComponent,
    SongPageComponent,
    LoadingComponent,
    SongListItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, BrowserAnimationsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
