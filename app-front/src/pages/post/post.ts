import { CookieService } from 'ng2-cookies';
import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User, Cookie } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
    selector: 'post',
    templateUrl: 'post.html'
})
export class PostPage {

    public $ID: number;

    public currentUser:any = {
        ID: "",
        display_name: "",
        metadata: {}
    };

    public currentPostItem: any = {
        ID: '',
        attachment: '',
        guid: '',
        post_author: {
            ID: '',
            display_name: ''
        },
        post_content: '',
        post_date: '',
        post_type: '',
        quantity_comments: ''
    };

    public commentText: string;
    public currentCommentItems: any;

    public loginErrorString;

    private $getPostUrl: string = 'learn/';

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        private params: NavParams,
        public translateService: TranslateService,
        private cookieService: CookieService) { 
    
            this.translateService.setDefaultLang('pt-br');

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Adicionando enviadors da view anterior
        this.$ID = this.params.get('post_id');

    }

    ionViewDidLoad() {        
        //Verifica existência do cookie e redireciona para página
        Cookie.checkCookie(this.cookieService, this.navCtrl); 
    }

    //Função que inicializa
    ngOnInit() {

        //Carrega dados do usuário de contexto
        this.getPost(); 

        this.user.subscribeUser(function ($this) {
            $this.currentUser = $this.user._user;
        }, this);

    }

    public setPostUrl() {
        //Adiciona url para exibir perfis de conexão
        return this.$getPostUrl = '';
    }

    public getPost() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.get(this.$getPostUrl + this.$ID).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores a variavel global
            this.currentPostItem = resp;

            //Adiciona os paragrafos via sequencia de caracteres = &nbsp;
            this.currentPostItem.post_content = this.currentPostItem.post_content.replace(/\n/g, '<br />');

            //Adiciona lista de comentários
            this.currentCommentItems = this.currentPostItem.list_comments;

        }, err => {
            return;
        });

    }

    //Submeter um comentário ao post
    submitComment($postID: number, $event) {

        $event.preventDefault();

        //Enviado um comentário a determinada timeline
        let items = this.api.post('timeline/' + $postID, { comment_content: this.commentText }).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Sucesso 
            if (resp.success != undefined) {

                //Reseta formulário e esconde
                this.commentText = '';

                let toast = this.toastCtrl.create({
                    message: resp.success.comment,
                    duration: 8000,
                    position: 'bottom'
                });

                toast.present();

                this.getPost();
            }

        }, err => {
            return;
        });

    }


}
