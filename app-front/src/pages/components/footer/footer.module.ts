import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { FooterApp } from './footer';

@NgModule({
  declarations: [
    FooterApp
  ],
  imports: [
    TranslateModule.forChild(),
    IonicModule
  ],
  exports: [
    FooterApp
  ],
  bootstrap:[FooterApp],
  entryComponents: [FooterApp] 
})
export class FooterAppModule { }
