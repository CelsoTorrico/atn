import { MenuPageModule } from './../components/menu/menu.module';
import { ProfileSportsPageModule } from './sports-data/sports-data.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProfilePage } from './my-profile';
import { RlTagInputModule } from 'angular2-tag-input';
import { ProfileStatsPageModule } from './stats-data/stats-data.module';

@NgModule({
  declarations: [
    MyProfilePage
  ],
  imports: [
    IonicPageModule.forChild(MyProfilePage),
    TranslateModule.forChild(),
    RlTagInputModule,
    ProfileSportsPageModule,
    ProfileStatsPageModule,
    MenuPageModule
  ],
  exports: [
    MyProfilePage
  ], 
  entryComponents: []
})
export class ProfilePageModule { }
