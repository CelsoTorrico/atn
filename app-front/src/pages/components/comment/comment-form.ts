import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'comment-form',
    templateUrl: 'comment-form.html'
})
export class CommentForm {

    @Input() public $postID: number;
    @Input() public $parentID:number;
    @Input() public $type: string = '';
    @Input() commentShow: boolean = true;

    @Output() CommentUpdate = new EventEmitter();
    @Output() itemDeleted = new EventEmitter();

    commentText: string

    public currentUser: any = {
        ID: "",
        display_name: "",
        profile_img: "",
        metadata: {}
    };

    deleteMessage: any

    constructor(
        public api: Api,
        private alert: AlertController,
        public toastCtrl: ToastController,
        public navCtrl: NavController,
        private translateService: TranslateService) {

        this.translateService.get(["YOU_WILL_EXCLUDE_POST", "YOU_SURE", "DELETE", "CANCEL"]).subscribe((data) => {
            this.deleteMessage = data;
        })
    }

    //Retorna
    ngOnInit() {

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
    submitResponseComment($comment_ID: number, $event) {

        $event.preventDefault();

        //Se definido Id de comentário pai, usa-lo como 'id' da requisição
        let id = (this.$parentID)? this.$parentID : this.$postID;

        //Enviado um comentário a determinada timeline
        this.api.post(this.$type + id, { comment_content: this.commentText }).subscribe((resp: any) => {

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

    //Remover um comentário
    deleteComment($id: number = null, $index: number = null) {

        //Para execução quando $id for nulo
        if ($id == null) {
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
                            this.itemDeleted.emit({
                                index: $index
                            })
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
