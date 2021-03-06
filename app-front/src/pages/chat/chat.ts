import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController } from 'ionic-angular';
import { User, Cookie } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ng2-cookies';

@IonicPage({
    segment: 'chat',
})
@Component({
    selector: 'chat',
    templateUrl: 'chat.html'
})
export class ChatPage {

    public $chatRooms:any = [];

    public $roomSelected;

    public loginErrorString;

    private $getChat: string = 'chat';

    constructor(
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public navCtrl: NavController,
        public translateService: TranslateService) {
        
    }

    ionViewDidLoad(){
        /** Verifica se usuário já esta logado anteriormente na plataforma */
        this.user.isLoggedUser().then((resp) => {
            //Redireciona para a página de Login
            if (!resp) { 
                this.navCtrl.setRoot('Login');       
            } 
        });
    }

    //Função que inicializa
    ngOnInit() {
        //Carrega dados do usuário de contexto
        this.getChatRooms();
    }

    private getChatRooms() {

        //Retorna a lista de chat rooms
        this.api.get(this.$getChat).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
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

    //Abre uma nova página
    backButton() {
        if (this.navCtrl.canSwipeBack()) {
          this.navCtrl.getPrevious();
        } else {
          this.navCtrl.setRoot('Dashboard');
        }
      }

}
