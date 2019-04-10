import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Notify } from './notify';
import { NotifySingle } from './item/notify-single.component';

@NgModule({
  declarations: [Notify, NotifySingle],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    IonicModule
  ],
  exports: [Notify],
  bootstrap: [Notify],
  entryComponents:[Notify, NotifySingle], 
  schemas: [],
  providers: []
})
export class NotifyModule { }
