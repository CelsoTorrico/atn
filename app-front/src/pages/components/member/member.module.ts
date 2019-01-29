import { MemberChat } from './member-message.component';
import { MemberList } from './item/member-list';
import { MemberItem } from './item/member-item';
import { Member } from './member';
import { NgModule } from "@angular/core";
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';



@NgModule({
    declarations: [
        Member, MemberItem, MemberList, MemberChat
      ],
      imports: [
        TranslateModule.forChild(),
        FormsModule,
        IonicModule,
        CommonModule
      ],
      exports: [Member, MemberList, MemberChat],
      bootstrap: [Member],
      entryComponents:[Member, MemberItem, MemberList, MemberChat], 
      schemas: [],
      providers: []
})
export class MemberModule{}