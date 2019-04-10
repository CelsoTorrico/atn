import { TimelineSingle } from './item/timeline-single.component';
import { CommentModule } from './../comment/comment.module';
import { TimelineItem } from './item/timelineItem';
import { Timeline } from './timeline';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    Timeline, TimelineItem, TimelineSingle
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule,
    CommentModule
  ],
  exports: [Timeline],
  bootstrap: [Timeline],
  entryComponents:[Timeline, TimelineItem, TimelineSingle], 
  schemas: [],
  providers: []
})
export class TimelineModule { }
