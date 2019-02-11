import { ProfileResumeModule } from './../components/profile-resume/profile-resume.module';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { MemberModule } from './../components/member/member.module';
import { ProfileMessage } from './profile-message.component';
import { TimelineModule } from './../components/timeline/timeline.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [
    ProfilePage, ProfileMessage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild(),
    TimelineModule,
    MemberModule,
    ProfileResumeModule
  ],
  exports: [
    ProfilePage, ProfileMessage
  ], 
  entryComponents: [ProfileMessage]
})
export class ProfilePageModule { }
