import { MemberSuggestion } from './member-suggestion.component';
import { MemberUser } from './item/member-current-user';
import { MemberChat } from './member-message.component';
import { MemberList } from './item/member-list';
import { MemberItem } from './item/member-item';
import { Member } from './member';
import { NgModule } from "@angular/core";
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { MenuPageModule } from '../menu/menu.module';
import { MemberClub } from './item/member-club';

@NgModule({
    declarations: [
        Member, MemberItem, MemberList, MemberChat, MemberUser, MemberSuggestion, MemberClub
      ],
      imports: [
        TranslateModule.forChild(),
        FormsModule,
        IonicModule,
        CommonModule,
        MenuPageModule,
        PipesModule
      ],
      exports: [Member, MemberItem, MemberList, MemberChat, MemberUser,  MemberSuggestion, MemberClub],
      bootstrap: [Member],
      entryComponents:[Member, MemberItem, MemberList, MemberChat, MemberUser, MemberSuggestion, MemberClub], 
      schemas: [],
      providers: []
})
export class MemberModule{}