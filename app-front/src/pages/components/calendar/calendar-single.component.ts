import { DomSanitizer } from '@angular/platform-browser';
import { Api } from '../../../providers/api/api';
import { User } from '../../../providers/user/user';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TimelineSingle } from '../timeline/item/timeline-single.component';
import { CalendarView } from './calendar-view.component';

@Component({
  selector: 'calendar-single',
  templateUrl: 'calendar-single.html' 
})
export class CalendarSingle extends TimelineSingle {

  @Input()  public calendarAtributes: any;
  @Input()  public onlyRead:boolean = true;
  @Output() public calendarUpdate = new EventEmitter();

  public img_thumbnail:string; 
    
  constructor(public alert: AlertController,
              public translateService: TranslateService,
              public toastCtrl: ToastController,    
              public api: Api,
              public navCtrl: NavController,  
              public modalCtrl: ModalController,
              sanitizer: DomSanitizer) { 

              //Carregando dependencias classe pai
              super(alert, translateService, toastCtrl, api, navCtrl, modalCtrl, sanitizer);
              
              //Setando url
              super._setRequestUrl('calendar');

  }

  ngAfterContentInit() {
    //Carregar as imagens de thumbnail após conteúdo iniciar
    this.loadThumbnailImageFromArray();
  }

  //Emite um evento enviando dados do post a ser atualizado
  updateItem($post_id:number) {
    this.calendarUpdate.emit($post_id);
  }

  //Abrir modal carregando o componente
  openView($postID:number, event) {
    
    event.preventDefault();

    let modal = this.modalCtrl.create(CalendarView, { post_id: $postID });
    modal.present();  

  }

  //Verifica array de arquivos anexados
  loadThumbnailImageFromArray() {
    this.img_thumbnail = CalendarSingle.defineAttachment(this.calendarAtributes.attachment, 'image');
  }

  //Verifica array de arquivos anexado e exibe apenas o primeiro com formato de imagem
  static defineAttachment($attachment:any, $ext:string = 'image') {
    
    let $found:number, $media:string = '';

    let $typeFile:any = {
      image: /(jpg|jpeg|png|gif)$/i,
      file: /(ics)$/i
    };

    //Verifica se variavel é um array válido
    if($attachment != undefined && $attachment.length > 0) {

      for (const element of $attachment.reverse()) {
        //Retorna posicao encontrada
        $found = element.search($typeFile[$ext]);
        
        //Se maior que 0 e -1
        if ($found > 0) {
          $media = element;
          break;
        }
      }

    }

    return $media;

  }


}
