import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritePage } from './favorite';
import { MemberModule } from '../components/member/member.module';

@NgModule({
  declarations: [
    FavoritePage
  ],
  imports: [
    IonicPageModule.forChild(FavoritePage),
    TranslateModule.forChild(),
    MemberModule
  ],
  exports: [
    FavoritePage
  ]
})
export class ProfilePageModule { }
