import { MyProfileStatsComponent } from './stats-data/stats-data.component';
import { MyProfileSportsComponent } from './sports-data/sports-data.component';
import { ProfileStepDirective } from './profile-step.directive';
import { MyProfilePersonalDataComponent } from './personal-data/personal-data.component';
import { MenuPageModule } from './../components/menu/menu.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProfilePage } from './my-profile';
import { RlTagInputModule } from 'angular2-tag-input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileResumeModule } from '../components/profile-resume/profile-resume.module';

@NgModule({
  declarations: [
      MyProfilePage, 
      ProfileStepDirective,
      MyProfilePersonalDataComponent,
      MyProfileSportsComponent,
      MyProfileStatsComponent
  ],
  imports: [
    IonicPageModule.forChild(MyProfilePage),
    TranslateModule.forChild(),
    FormsModule,
    CommonModule,
    RlTagInputModule,
    MenuPageModule,
    ProfileResumeModule
  ],
  exports: [
    MyProfilePage, ProfileStepDirective
  ], 
  entryComponents: [
    MyProfilePersonalDataComponent,
    MyProfileSportsComponent,
    MyProfileStatsComponent
  ],
  bootstrap:[MyProfilePage]
})
export class ProfilePageModule { }
