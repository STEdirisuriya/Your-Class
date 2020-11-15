import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

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


const routes: Routes = [
      { path: 'profile', component: ProfileComponent },
      { path: 'chat', component: ChatComponent,
        children: [
          { path: ':id', outlet: 'chatbox', component: ChatIDComponent}
        ]
      },
      // {
      //   path: 'chat-id/:id',
      //   component: ChatIDComponent,
      // },
      { path: 'videos', component: VideosComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'tests', component: TestsComponent },
      { path: 'games', component: GamesComponent },
      { path: 'settings', component: SettingsComponent },
      {path: 'classes/addClass', component: AddClassComponent},
      { path: '', redirectTo: '/profile', pathMatch: 'full'},
      { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
