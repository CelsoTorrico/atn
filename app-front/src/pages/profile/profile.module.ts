import { BrowserModule } from '@angular/platform-browser';
import { TimelineModule } from './../components/timeline/timeline.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild(),
    TimelineModule 
  ],
  exports: [
    ProfilePage
  ]
})
export class ProfilePageModule { }
