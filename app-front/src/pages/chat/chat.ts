import { MemberChat } from './../components/member/member-message.component';
import { Api } from '../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

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
        public translateService: TranslateService) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
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
