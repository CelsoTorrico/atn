import { TimelineSingle } from './item/timeline-single.component';
import { CommentModule } from './../comment/comment.module';
import { TimelineItem } from './item/timelineItem';
import { Timeline } from './timeline';
import { TimelineAdmin } from './timeline-admin';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    Timeline, TimelineItem, TimelineSingle, TimelineAdmin
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule, 
    CommonModule,
    CommentModule
  ],
  exports: [Timeline, TimelineAdmin],
  bootstrap: [Timeline, TimelineAdmin],
  entryComponents:[Timeline, TimelineItem, TimelineSingle, TimelineAdmin], 
  schemas: [],
  providers: []
})
export class TimelineModule { }
