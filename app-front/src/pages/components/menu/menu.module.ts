import { MyProfileMenu } from './my-profile-menu';
import { NavMenu } from './nav-menu';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuPage } from './menu';
import { IonicModule } from 'ionic-angular';
import { UserMenu } from './user-menu';

@NgModule({
  declarations: [
    MenuPage, NavMenu, MyProfileMenu, UserMenu
  ],
  imports: [
    TranslateModule.forChild(),
    IonicModule
  ],
  exports: [
    MenuPage, NavMenu, MyProfileMenu, UserMenu
  ],
  bootstrap:[NavMenu],
  entryComponents: [MenuPage, NavMenu, MyProfileMenu, UserMenu] 
})
export class MenuPageModule { }
