import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { MemberModule } from './../components/member/member.module';
import { CommentModule } from './../components/comment/comment.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular'; 
import { SearchPage } from './search';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    TagInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommentModule,
    MemberModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule { }
