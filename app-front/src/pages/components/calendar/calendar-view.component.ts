import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api } from '../../../providers';
import { CalendarSingle } from './calendar-single.component';
import { TimelineItem } from '../timeline/item/timelineItem';

@Component({ 
  selector: 'calendar-view',
  templateUrl: 'calendar-view.html'
})
export class CalendarView extends TimelineItem { 

  public TimelineItem:any = {
    ID: '',
    attachment: <any>[],
    post_author: {
      ID: '',
      display_name: '',
      profile_img: {}
    },
    post_meta: {
      post_calendar_address: '',
      post_calendar_date: [],
      post_calendar_type: ''
    },
    post_date: '',
    post_title: '',
    post_excerpt: '',
    post_content: '',    
    quantity_comments: ''

  }; 

  public $postID:number;

  public eventImgAttachment:string;

  public eventICSAttachment:string;

  public currentCommentItems:any[];

  constructor(
    public api: Api,
    public navCtrl: NavController,
    public params: NavParams,
    public viewer: ViewController, 
    public translateService: TranslateService) { 

      super(api, navCtrl, params, viewer, translateService); //Extende classe pai  

      //Seta o ID de requisição
      super._setPostID(this.params.get('post_id'));   
      
      //Muda a url de requisição
      super._setUrl('calendar/');      

  }
  
  //Inicialização
  ngOnInit() {
    
    //Função para ser executada logo após os dados requisitados serem 
    let $fn = function($class:CalendarView){ 
      $class.eventImgAttachment = CalendarSingle.defineAttachment($class.TimelineItem.attachment, 'image');
      $class.eventICSAttachment = CalendarSingle.defineAttachment($class.TimelineItem.attachment, 'file')
    };

    this.query($fn);
  }

  //Renderizar embeds de vídeo no conteúdo
  contentFilter($content:string){
    return CalendarSingle.showVideoAttachment($content);
  }


}
