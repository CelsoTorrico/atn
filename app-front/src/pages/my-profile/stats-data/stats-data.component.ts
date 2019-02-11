import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';


@Component({
    selector: 'stats-data',
    templateUrl: 'stats-data.html'
})
export class MyProfileStatsComponent {

    public myStatsData: any = {
        metadata:{
            jogos:{
                value: <string>'',
                visibility: <number>null
            },
            vitorias:{
                value: <string>'',
                visibility: <number>null
            },
            derrotas:{
                value: <string>'',
                visibility: <number>null
            },
            empates:{
                value: <string>'',
                visibility: <number>null
            },
            titulos:{
                value: <string>'',
                visibility: <number>null
            },
            titulos_conquistas:{
                value: <string>'',
                visibility: <number>null
            },
            stats:{
                value: <string>'',
                visibility: <number>null
            },
            stats_sports:{
                value: <string>'',
                visibility: <number>null
            }
        }
    }

    public loginErrorString;

    private static $getProfile: string = 'user/self';

    constructor(
        public navCtrl: NavController,
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
        this.getCurrentUser();
    }

    //Retorna dados do usuário corrente
    private getCurrentUser() {

        //Retorna os dados de usuário e atribui ao seletor
        let $selfRequest = this.api.get(MyProfileStatsComponent.$getProfile).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return; 
            }

            //Adicionando valores a classe user
            this.user._user = resp;
            this.myStatsData = this.user.fillMyProfileData();          

            //Workaround para parametro de objeto sem acesso direto
            let $vParameter = 'my-videos';

            //Atribui valores ao objeto
            this.myStatsData.videos = resp.metadata[$vParameter];

        }, err => {
            return;
        });

    }

}