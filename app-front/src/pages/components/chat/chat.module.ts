import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chat } from './chat';
import { SocketIoModule, SocketIoConfig} from 'ng-socket-io'; 
import { environment } from '../../../environments/environment';

//Development
const config: SocketIoConfig = {url: environment.socketIO, options:{
  secure: environment.socketSecure
} }

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
