import { ChatModule } from './../components/chat/chat.module';
import { MemberModule } from './../components/member/member.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    TranslateModule.forChild(),
    CommonModule,
    MemberModule, 
    ChatModule
  ],
  exports: [ChatPage],
  bootstrap:[],
  entryComponents: [ChatPage] 
})
export class ChatPageModule { }
