import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chat } from './chat';
import { SocketIoModule, SocketIoConfig} from 'ng-socket-io'

const config: SocketIoConfig = {url: 'http://localhost:8890', options:{} }

@NgModule({
  declarations: [
    Chat
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    CommonModule,
    SocketIoModule.forRoot(config)
  ],
  exports: [Chat],
  bootstrap: [Chat],
  entryComponents:[Chat], 
  schemas: [],
  providers: []
})
export class ChatModule { }
