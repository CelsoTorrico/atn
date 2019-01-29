import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';

@NgModule({
  declarations: [
   CommentItem, CommentForm
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule
  ],
  exports: [CommentItem],
  bootstrap: [],
  entryComponents:[CommentItem, CommentForm], 
  schemas: [],
  providers: []
})
export class CommentModule { }
