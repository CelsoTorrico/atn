import { MenuPageModule } from '../../components/menu/menu.module';
import { MyProfileStatsPage } from './stats-data';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { RlTagInputModule } from 'angular2-tag-input';

@NgModule({
  declarations: [
    MyProfileStatsPage
  ],
  imports: [
    IonicPageModule.forChild(MyProfileStatsPage),
    TranslateModule.forChild(),
    RlTagInputModule,
    MenuPageModule
  ],
  exports: [
    MyProfileStatsPage
  ], 
  entryComponents: []
})
export class ProfileStatsPageModule { }
