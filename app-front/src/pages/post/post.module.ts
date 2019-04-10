import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';
import { CommentModule } from '../components/comment/comment.module';

@NgModule({
  declarations: [
    PostPage
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
    TranslateModule.forChild(),
    CommonModule,
    CommentModule
  ],
  exports: [
    PostPage
  ]
})
export class PostPageModule { }
