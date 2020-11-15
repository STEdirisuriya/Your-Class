import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { FieldBarComponent } from './field-bar/field-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { WindowComponent } from './window/window.component';
import { ProfileComponent } from './in-window/profile/profile.component';
import { ChatComponent } from './in-window/chat/chat.component';
import { VideosComponent } from './in-window/videos/videos.component';
import { ClassesComponent } from './in-window/classes/classes.component';
import { LibraryComponent } from './in-window/library/library.component';
import { TestsComponent } from './in-window/tests/tests.component';
import { GamesComponent } from './in-window/games/games.component';
import { SettingsComponent } from './in-window/settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChatIDComponent } from './in-window/chat-window/chat-id/chat-id.component';
import { AddClassComponent } from './in-window/classes/add-class/add-class.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    FieldBarComponent,
    SideBarComponent,
    WindowComponent,
    ProfileComponent,
    ChatComponent,
    VideosComponent,
    ClassesComponent,
    LibraryComponent,
    TestsComponent,
    GamesComponent,
    SettingsComponent,
    PageNotFoundComponent,
    ChatIDComponent,
    AddClassComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  HttpClientModule
  ],
  providers: [],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
