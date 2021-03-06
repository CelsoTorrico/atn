import { MyProfileCalendarComponent } from './calendar-data/calendar-data.component';
import { TagInputModule } from 'ngx-chips';
import { MyProfileAddMemberDataComponent } from './team-data/team-data.component';
import { MyProfileAchievementsComponent } from './achievements-data/achievements-data.component';
import { MyProfileSportsComponent } from './sports-data/sports-data.component';
import { ProfileStepDirective } from './profile-step.directive';
import { MyProfilePersonalDataComponent } from './personal-data/personal-data.component';
import { MenuPageModule } from './../components/menu/menu.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProfilePage } from './my-profile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatsList } from '../../providers/useful/stats';
import { PipesModule } from '../../pipes/pipes.module';
import { MyProfileStatsComponent } from './stats-data/stats-data.component';
import { MyProfileGeneralStatsComponent } from './general-stats-data/general-stats-data.component';
import { MyProfileVideosComponent } from './videos-data/videos-data.component';
import { CareerList } from '../../providers/career/career';

@NgModule({
  declarations: [
    MyProfilePage,
    ProfileStepDirective,
    MyProfilePersonalDataComponent,
    MyProfileSportsComponent,
    MyProfileVideosComponent,
    MyProfileGeneralStatsComponent,
    MyProfileAchievementsComponent,
    MyProfileStatsComponent,
    MyProfileAddMemberDataComponent,
    MyProfileCalendarComponent
  ],
  imports: [
    IonicPageModule.forChild(MyProfilePage), 
    TranslateModule.forChild(),
    CommonModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    MenuPageModule, 
    PipesModule
  ],
  exports: [
    MyProfilePage, ProfileStepDirective
  ],
  entryComponents: [
    MyProfilePersonalDataComponent,
    MyProfileSportsComponent,
    MyProfileVideosComponent,
    MyProfileGeneralStatsComponent,
    MyProfileAchievementsComponent,
    MyProfileStatsComponent,
    MyProfileAddMemberDataComponent,
    MyProfileCalendarComponent
  ],
  bootstrap: [MyProfilePage],
  providers: [
    StatsList,
    CareerList
  ]
})
export class MyProfilePageModule { }
