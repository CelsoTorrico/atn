import { Api } from './../../../providers/api/api';
import { User } from './../../../providers/user/user';
import { EventEmitter } from 'events';
import { Component, Input, Output } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TimelineSingle } from '../timeline/item/timeline-single.component';

@Component({
  selector: 'calendar-item',
  templateUrl: 'calendar-item.html' 
})
export class CalendarSingle extends TimelineSingle {

  @Input() public calendarAtributes: any;

  @Output() calendarDeleted = new EventEmitter();
    
  constructor(public user: User,
              public alert: AlertController,
              public translateService: TranslateService,
              public toastCtrl: ToastController,    
              public api: Api,
              public navCtrl: NavController) {

              super(user, alert, translateService, toastCtrl, api, navCtrl);

              super.setRequestUri('calendar');

  }

}
