import { ToastController, NavParams, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api, User } from '../../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'timeline-single',
  templateUrl: 'timeline-single.html'
})
export class TimelineSingle {

  public $postID: number;

  public currentUser:any = {
      ID: "",
      display_name: "",
      metadata: {
          profile_img:{
              value: ""
          }
      }
  };

  @Input() public currentTimeline: any = {
    ID: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: { 
        value: null
      }
    },
    post_date: '',
    post_content: '',
    attachment: '',
    quantity_comments: ''
  };

  @Output() CommentUpdate = new EventEmitter()

  @Output() timelineDeleted = new EventEmitter();

  public commentText: string;

  public commentShow: any;

  deleteMessage:any;

  constructor(
    public user: User,
    private toastCtrl: ToastController,
    private alert: AlertController,
    private api: Api,
    private navCtrl: NavController,
    public translateService: TranslateService) { 
      
      this.translateService.setDefaultLang('pt-br');
      this.translateService.get(["YOU_WILL_EXCLUDE_POST", "YOU_SURE"]).subscribe((data) => {
        this.deleteMessage = data;
      })
    }

  //Retorna
  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.user.subscribeUser(function($this){
      $this.currentUser = $this.user._user; 
    }, this);
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

  //Mostrar campo de comentário
  openComment(event) {
    event.preventDefault();
    this.commentShow = true;
  }

  //Deletar um comentário
  deleteTimeline() {

    let confirmDelete = this.alert.create({
      title: this.deleteMessage.YOU_WILL_EXCLUDE_POST,
      subTitle: this.deleteMessage.YOU_SURE,
      buttons: [{
        text: 'DELETE',
        handler: data => {
          this.api.delete('timeline/' + this.currentTimeline.ID).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
              return;
            }

            //Sucesso 
            if (resp.success != undefined) {
              //Emite um evento para ser capturado pelo componente pai
              this.timelineDeleted.emit(this.currentTimeline.ID);
            }

          }, err => {
            return;
          });
        }
      }, {
        text: 'CANCEL',
      }]
    });

    confirmDelete.present();

  }

  //Submeter um comentário ao post
  submitComment($postID: number, $event) {

    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    this.api.post('timeline/' + $postID, { comment_content: this.commentText }).subscribe((resp: any) => {

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


}
