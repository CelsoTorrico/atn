import { CommentModule } from './../comment/comment.module';
import { LearnItem } from './learnItem';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Learn } from './learn';

@NgModule({
  declarations: [
   Learn, LearnItem
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule,
    CommentModule
  ],
  exports: [Learn],
  bootstrap: [Learn],
  entryComponents:[Learn, LearnItem], 
  schemas: [],
  providers: []
})
export class LearnContainerModule {}
