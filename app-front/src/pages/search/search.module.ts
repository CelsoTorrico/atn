import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { MemberModule } from './../components/member/member.module';
import { CommentModule } from './../components/comment/comment.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular'; 
import { SearchPage } from './search';
import { GenderList } from '../../providers/gender/gender';
import { profileTypeList } from '../../providers/profiletypes/profiletypes';
import { SportList } from '../../providers/sport/sport';
import { ClubList } from '../../providers/clubs/clubs';
import { VisibilityList } from '../../providers/visibility/visibility';

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
  ],
  providers: [
    GenderList,
    profileTypeList,
    SportList,
    ClubList,
    VisibilityList
  ]
})
export class SearchPageModule { }
