import { MemberModule } from './../components/member/member.module';
import { CommentModule } from './../components/comment/comment.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular'; 
import { SearchPage } from './search';
import { RlTagInputModule } from 'angular2-tag-input';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    RlTagInputModule,
    CommentModule,
    MemberModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule { }
