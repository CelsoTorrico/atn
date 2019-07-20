import { CommentForm } from './comment-form';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentItem } from './comment-item';

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
  exports: [CommentItem, CommentForm],
  bootstrap: [],
  entryComponents:[CommentItem, CommentForm], 
  schemas: [],
  providers: []
})
export class CommentModule { }
