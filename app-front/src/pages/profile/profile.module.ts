import { Message } from './message.component';
import { TimelineModule } from './../components/timeline/timeline.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [
    ProfilePage, Message
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild(),
    TimelineModule
  ],
  exports: [
    ProfilePage, Message
  ], 
  entryComponents: [Message]
})
export class ProfilePageModule { }
