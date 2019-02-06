import { MenuPageModule } from './../../components/menu/menu.module';
import { MyProfileSportsPage } from './sports-data';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { RlTagInputModule } from 'angular2-tag-input';

@NgModule({
  declarations: [
    MyProfileSportsPage
  ],
  imports: [
    IonicPageModule.forChild(MyProfileSportsPage),
    TranslateModule.forChild(),
    RlTagInputModule,
    MenuPageModule
  ],
  exports: [
    MyProfileSportsPage
  ], 
  entryComponents: []
})
export class ProfileSportsPageModule { }
