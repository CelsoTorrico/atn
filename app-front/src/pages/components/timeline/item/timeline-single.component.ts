import { DomSanitizer } from '@angular/platform-browser';
import { TimelineItem } from './timelineItem';
import { ToastController, AlertController, ModalController } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api, User } from '../../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'timeline-single',
  templateUrl: 'timeline-single.html'
})
export class TimelineSingle {

  @Output() CommentUpdate = new EventEmitter()

  @Output() timelineDeleted = new EventEmitter();

  @Input() public currentTimeline: any = {
    ID: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: { 
        value: ''
      }
    },
    post_date: '',
    post_content: '',
    attachment: '',
    quantity_comments: ''
  };

  public $requestUri:string;

  private uri = 'timeline';

  public $postID: number;

  public currentUser:any = {
      ID: "",
      display_name: "", 
      metadata: {}    
  };

  public commentText: string;

  public commentShow: any;

  public deleteMessage:any;

  constructor(
    public user: User,
    public alert: AlertController,
    public translateService: TranslateService,
    public toastCtrl: ToastController,    
    public api: Api,
    public navCtrl: NavController,
    public modalCtrl:ModalController,
    public domSanitizer: DomSanitizer) {
      
      //Definindo url de requisição
      this.$requestUri = this.uri;

      this.translateService.setDefaultLang('pt-br');
      this.translateService.get(["YOU_WILL_EXCLUDE_POST", "YOU_SURE","DELETE", "CANCEL"]).subscribe((data) => {
        this.deleteMessage = data;
      })

    }

  //Inicialização
  ngOnInit() {
    this.getCurrentUser();
  }

  //Carrega dados de usuário
  getCurrentUser(){
    this.user.subscribeUser(function($this) {
      $this.currentUser = $this.user._user;
    }, this);
  }

  //Setar url de requisição
  _setRequestUrl($url:string) {
    this.uri = $url;
  }

  //Carregar comentários
  setLike($postID: number, event) {

    event.preventDefault();

    this.api.get('like/' + $postID).subscribe((resp: any) => {

      if (resp.success != undefined) {
        let el = event.target.parentNode;
        if (el.classList.contains("active")) {
          el.classList.remove("active");
          el.classList.add("inactive");
        } else {
          el.classList.add("active")
          el.classList.remove("inactive");
        }
      }

    });

  }

  //Abrir modal carregando o componente
  openView($postID:number, event) {
    
    event.preventDefault();

    //Impede de executar ações em cascata em botões com evento
    if(event.target.tagName == 'IMG' || event.target.classList.contains('count-responses') 
    || event.target.classList.contains('open-view')) {
      //Invoca um modal passando ID da Timeline
      
      let modal = this.modalCtrl.create(TimelineItem, { post_id: $postID });
      modal.present();  
    }

  }

  //Mostrar campo de comentário
  openComment(event) {
    event.preventDefault();
    this.commentShow = true;
  }

  //Deletar um comentário
  deleteTimeline($post_id:number) {

    let confirmDelete = this.alert.create({
      title: this.deleteMessage.YOU_WILL_EXCLUDE_POST,
      subTitle: this.deleteMessage.YOU_SURE,
      buttons: [{
        text: this.deleteMessage.DELETE,
        handler: data => {
          this.api.delete(this.$requestUri + '/' + $post_id).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
              return;
            }

            //Sucesso 
            if (resp.success != undefined) {
              //Emite um evento para ser capturado pelo componente pai
              this.timelineDeleted.emit($post_id);
            }

          }, err => {
            return;
          });
        }
      }, {
        text: this.deleteMessage.CANCEL, 
      }]
    });

    confirmDelete.present();

  }

  //Submeter um comentário ao post
  submitComment($postID: number, $event) {

    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    this.api.post(this.$requestUri + '/' + $postID, { comment_content: this.commentText }).subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Sucesso 
      if (resp.success != undefined) {

        //Emite um evento para ser capturado pelo componente pai
        this.CommentUpdate.emit(this.currentTimeline.ID);

        //Reseta formulário e esconde
        this.commentText = '';
        this.commentShow = false;

        let toast = this.toastCtrl.create({ 
          message: resp.success.comment,
          duration: 8000,
          position: 'bottom'
        });

        toast.present();
      }

    }, err => {
      return;
    });

  }

  //Abre uma nova página de profile
  goToProfile($user_id: number) {
    this.navCtrl.push('ProfilePage', {
      user_id: $user_id
    });
  }

  //Incorporar videos do Youtube 
  static showVideoAttachment($content:string):string {
    
    let $expression:string = '/https\:\/\/www\.youtube\.com\/watch\?v\=([^\s\n]*)/gm';

    //Verifica se variavel é um array válido
    if($content != undefined && $content.length > 0) {
      
      //Substitui links do youtube para exibição
      $content = $content.replace(/https\:\/\/www\.youtube\.com\/watch\?v\=([^\s\n]*)/gm, 
      function(youtube, p1) {
          
          let url = 'https://www.youtube.com/embed/' + p1; //Url do vídeo
          //TimelineSingle.bypassSecurityTrustResourceUrl(url);

          youtube = url;           
          
          return youtube;
      });    
      
    }

    return $content;

  }


}
