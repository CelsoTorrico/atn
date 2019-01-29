import { NavMenu } from './nav-menu';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuPage } from './menu';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MenuPage, NavMenu
  ],
  imports: [
    TranslateModule.forChild(),
    IonicModule
  ],
  exports: [
    MenuPage, NavMenu
  ],
  bootstrap:[NavMenu],
  entryComponents: [MenuPage, NavMenu] 
})
export class MenuPageModule { }
