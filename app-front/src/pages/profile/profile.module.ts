import { ProfileResumeModule } from './../components/profile-resume/profile-resume.module';
import { MemberModule } from './../components/member/member.module';
import { ProfileMessage } from './profile-message.component';
import { TimelineModule } from './../components/timeline/timeline.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { StatsList } from '../../providers/useful/stats';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';
import { ProfileViewDirective } from './profile-view.directive';
import { NgChartjsModule } from 'ng-chartjs';
import { PipesModule } from '../../pipes/pipes.module';
import { MyProfilePersonalDataComponent } from '../my-profile/personal-data/personal-data.component';

@NgModule({
  declarations: [
    ProfilePage, ProfileMessage, 
    ProfileViewDirective,
    ProfileComponent, 
    StatsComponent
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild(),
    TimelineModule,
    MemberModule,
    ProfileResumeModule,
    PipesModule
  ],
  exports: [
    ProfilePage, ProfileMessage, ProfileViewDirective
  ], 
  entryComponents: [
    ProfileMessage, 
    ProfileComponent,
    StatsComponent
  ],
  providers: [
    StatsList
  ]
})
export class ProfilePageModule { }
