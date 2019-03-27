import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController } from 'ionic-angular';
import { User, Cookie } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ng2-cookies';

@IonicPage()
@Component({
    selector: 'chat',
    templateUrl: 'chat.html'
})
export class ChatPage {

    public $chatRooms: string = '';

    public $roomSelected;

    public loginErrorString;

    private $getChat: string = 'chat';

    constructor(
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public navCtrl: NavController,
        public translateService: TranslateService,
        private cookieService: CookieService) {

        this.translateService.setDefaultLang('pt-br');
        
    }

    ionViewDidLoad() {        
        //Verifica existência do cookie e redireciona para página
        Cookie.checkCookie(this.cookieService, this.navCtrl); 
    }

    //Função que inicializa
    ngOnInit() {
        //Carrega dados do usuário de contexto
        this.getChatRooms();
    }

    private getChatRooms() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.get(this.$getChat).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores a variavel global
            this.$chatRooms = resp;

        }, err => {
            return;
        });

    }

    loadData($event) {
        this.$roomSelected = $event;
    }

}
