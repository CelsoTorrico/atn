import { Timeline } from './timeline';
import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'timeline-admin',
  templateUrl: 'timeline.html'
})
export class TimelineAdmin extends Timeline {
  
  //Lista de Items 
  @Input()  public currentItems:any[] = [];
  public commentText:any = { comment_content : <string> ''}; 
  public commentShow:any;

  constructor(
    public api: Api,
    public user:User,
    public modalCtrl: ModalController,
    public translateService: TranslateService) {     
      
      super(api, user, modalCtrl, translateService);

      //Setando url de requisições
      this._setUrl('timeline/annunciaments'); 
    } 

}
