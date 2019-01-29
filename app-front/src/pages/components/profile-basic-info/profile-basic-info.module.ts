import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule
  ],
  exports: [],
  bootstrap: [],
  entryComponents:[], 
  schemas: [],
  providers: []
})
export class ProfileInfoModule { }
