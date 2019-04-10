import { MemberCurrentMenu } from './member-current-menu';
import { MyProfileMenu } from './my-profile-menu';
import { NavMenu } from './nav-menu';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { UserMenu } from './user-menu';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    NavMenu, MyProfileMenu, UserMenu, MemberCurrentMenu
  ],
  imports: [
    TranslateModule.forChild(),
    IonicModule,
    PipesModule
  ],
  exports: [
    NavMenu, MyProfileMenu, UserMenu, MemberCurrentMenu
  ],
  bootstrap:[NavMenu],
  entryComponents: [NavMenu, MyProfileMenu, UserMenu, MemberCurrentMenu] 
})
export class MenuPageModule { }
