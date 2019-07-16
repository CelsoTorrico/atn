import { CalendarModule } from './../components/calendar/calendar.module';
import { ClubComponent } from './profile-components/club.component';
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
import { PipesModule } from '../../pipes/pipes.module'; 
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ProfilePage, 
    ProfileMessage, 
    ProfileViewDirective,
    ProfileComponent, 
    StatsComponent,
    ClubComponent,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild(),
    TimelineModule,
    MemberModule,
    ProfileResumeModule,
    PipesModule,
    CalendarModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    ProfilePage, ProfileMessage, ProfileViewDirective
  ], 
  entryComponents: [
    ProfileMessage, 
    ProfileComponent,
    StatsComponent,
    ClubComponent,
  ],
  providers: [
    StatsList
  ]
})
export class ProfilePageModule { }
