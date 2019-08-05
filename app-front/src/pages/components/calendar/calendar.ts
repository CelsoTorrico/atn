import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Timeline } from '../timeline/timeline';
import { Api, User } from '../../../providers';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class Calendar extends Timeline { 

  //Parametros de URL
  @Input()  public timelineID:number;
  @Input()  public onlyRead: boolean = true;
  @Output() public updateEvent = new EventEmitter();
 
  //Lista de Items 
  @Input()  public currentItems:any[] = [];
  public commentText:any = { comment_content : <string> ''}; 
  public commentShow:any;


  constructor(
    public  api:Api,
    public  user:User,
    public  modalCtrl:ModalController,
    public  translateService:TranslateService) {
      //Dependencias da classe pai  
      super(api, user, modalCtrl, translateService);
    
      //Setando url de requisições
      this._setUrl('calendar'); 
  }

  /** Solicitação de update */
  calendarUpdate($event, $index) {
    //Emite evento com os dados juntamente com esse componente
    this.updateEvent.emit({
        form: 'calendarData', 
        component: this,
        event: $event,
        index: $index
    });
  }

}
