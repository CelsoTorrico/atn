import { Component } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';


@Component({
    selector: 'general-stats-data',
    templateUrl: 'general-stats-data.html' 
})
export class MyProfileGeneralStatsComponent {

    type: number = null;

    jogos: any = {
        value: <string>'',
        visibility: <number>null
    }

    vitorias: any = {
        value: <string>'',
        visibility: <number>null
    }

    derrotas: any = {
        value: <string>'',
        visibility: <number>null
    }

    empates: any = {
        value: <string>'',
        visibility: <number>null
    }

    titulos: any = {
        value: <string>'',
        visibility: <number>null
    }

    public loginErrorString;

    public statsFields: any[] = [];

    private static $getProfile: string = 'user/self';

    constructor(
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public translateService: TranslateService) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }

    //Função que inicializa
    ngOnInit() {
        this.currentUser();
    }

    private currentUser() {

        this.user._userObservable.subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores a classe user
            let atributes = resp;

            //Intera sobre objeto e atribui valor aos modelos de metadata
            for (var key in atributes.metadata) {
                if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
                    this[key] = atributes.metadata[key];
                }
            }

            //Atribuindo dados aos modelos
            this.type = atributes.type.ID;

        }, err => {
            return;
        });
    }

    //Fechar modal
    dismiss() {
        this.viewCtrl.dismiss();
    }

    customTrackBy(index: number, item: any): number {
        return index;
    }

}