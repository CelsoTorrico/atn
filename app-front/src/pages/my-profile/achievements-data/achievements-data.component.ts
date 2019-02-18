import { Component } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';


@Component({
    selector: 'achievements-data',
    templateUrl: 'achievements-data.html'
})
export class MyProfileAchievementsComponent {

    titulos_conquistas: any = {
        value: <string>'',
        visibility: <number>null
    }

    public loginErrorString;

    private static $getProfile: string = 'user/self';

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        public statsList: StatsList) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }

    //Função que inicializa
    ngOnInit() {
        this.currentUser();
    }

    //Retorna dados do usuário
    private currentUser() {

        this.user._userObservable.subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores a classe user
            let atributes = resp;

            //Atribuir data de usuário ao modelo
            this.titulos_conquistas = atributes.metadata['titulos-conquistas'];

        }, err => {
            return;
        });
    }

    //Fechar modal
    dismiss() {
        this.viewCtrl.dismiss();
    }

    customTrackBy(index: number, item: any): number {
        console.log(item);
        return index;
    }

}