import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'comments',
  templateUrl: 'comment-item.html'
})
export class CommentItem { 

  @Input() public currentCommentItems: any = [
    {
      comment_ID: '',
      comment_author: '',
      comment_date: '',
      comment_content: '',
      responses: [],
      user_id: null
    }
  ];

  @Input() public $postID: number;

  @Output() CommentUpdate = new EventEmitter()

  public commentText: string;

  public currentUser: any = {
    ID: "",
    display_name: "",
    metadata: {}
  };

  deleteMessage:any;

  constructor(
    public api: Api,
    public user: User,
    private alert: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public translateService: TranslateService) {
      this.translateService.get(["YOU_WILL_EXCLUDE_POST", "YOU_SURE","DELETE", "CANCEL"]).subscribe((data) => {
        this.deleteMessage = data;
      })
    }

  //Retorna
  ngOnInit() {
    this.user.subscribeUser(function ($this) {
      $this.currentUser = $this.user._user;
    }, this);
  }

  //Mostrar campo de comentário
  openComment($comment_ID: number, event) {
    event.preventDefault();
    let $form = document.getElementById('form-' + $comment_ID);
    $form.style.display = 'block';
  }

  //Abre uma nova página de profile
  goToProfile($user_id: number) {
    this.navCtrl.push('ProfilePage', { 
      user_id: $user_id
    });
  }

  //Submeter um comentário ao post
  submitComment($comment_ID:number, $event, $resp:string = '') {

    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    this.api.post('timeline/' + $resp + $comment_ID,{ comment_content: this.commentText }).subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Sucesso 
      if (resp.success != undefined) {

        //Emite um evento a ser capturado
        this.CommentUpdate.emit('commentIn' + $comment_ID);

        //Reseta campo
        this.commentText = '';

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

  //Adicionar resposta a um comentário
  submitResponseComment($comment_ID:number, $event){
    this.submitComment($comment_ID, $event, 'comment/');
  }

  //Remover um comentário
  deleteComment( $id:number = null, $index:number = null ){

    //Para execução quando $id for nulo
    if($id == null){
      return;
    }

    let confirmDelete = this.alert.create({
      title: this.deleteMessage.YOU_WILL_EXCLUDE_POST,
      subTitle: this.deleteMessage.YOU_SURE,
      buttons: [{
        text: this.deleteMessage.DELETE,
        handler: data => {
          this.api.delete('comment/' + $id).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
              return;
            }

            //Sucesso 
            if (resp.success != undefined) {
              //Emite um evento para ser capturado pelo componente pai
              this.currentCommentItems.splice($index, 1);  
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


}
