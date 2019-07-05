import { CalendarSingle } from './calendar-component';
import { NgModule } from "@angular/core";
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    CalendarSingle
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule,
    PipesModule
  ],
  exports: [CalendarSingle],
  bootstrap: [CalendarSingle],
  entryComponents: [CalendarSingle],
  schemas: [],
  providers: []
})
export class CalendarModule { }