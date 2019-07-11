import { CommentModule } from './../comment/comment.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { CalendarView } from './calendar-view.component';
import { CalendarSingle } from "./calendar-single.component";

@NgModule({
  declarations: [
    CalendarSingle, CalendarView
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule,
    PipesModule,
    CommentModule 
  ],
  exports: [CalendarSingle, CalendarView],
  bootstrap: [CalendarSingle],
  entryComponents: [CalendarSingle, CalendarView],
  schemas: [],
  providers: []
})
export class CalendarModule { }