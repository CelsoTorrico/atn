import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { BrazilStates } from '../../providers/useful/states';

@IonicPage()
@Component({
    selector: 'my-profile',
    templateUrl: 'my-profile.html'
})
export class MyProfilePage {

    public myProfileData: any = {
        ID: <number>null,
        display_name: <string>'',
        type:  {
            ID: <number>null
        },
        sport: <any>[],
        clubs: <any>[],
        metadata: {
            biography: {
                value: <string>'',
                visibility: <number>null
            },
            birthdate:{
                value: <string>'',
                visibility: <number>null
            },
            rg:{
                value: <string>'',
                visibility: <number>null
            },
            cpf:{
                value: <string>'',
                visibility: <number>null
            },
            cnpj:{
                value: <string>'',
                visibility: <number>null
            },
            gender:{
                value: <string>'',
                visibility: <number>null
            },
            telefone:{
                value: <string>'',
                visibility: <number>null
            },
            profile_img: {
                value: <string>'',
                visibility: <number>null
            },
            address: {
                value: <string>'',
                visibility: <number>null
            }, 
            neighborhood: {
                value: <string>'',
                visibility: <number>null
            },
            city: {
                value: <string>'',
                visibility: <number>null
            },
            state: {
                value: <string>'',
                visibility: <number>null
            },
            country: {
                value: <string>'',
                visibility: <number>null
            },
            zipcode: {
                value: <string>'',
                visibility: <number>null
            }
        }
    };

    //Lista de Estados
    protected $statesList = [];

    public loginErrorString;

    private static $getProfile: string = 'user/self';

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public states:BrazilStates) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Carrega lista de estados do provider
        this.$statesList = this.states.statesList; 

    }

    //Função que inicializa
    ngOnInit() {
        this.getCurrentUser();
    }

    //Retorna dados do usuário corrente
    private getCurrentUser() {

        //Retorna os dados de usuário e atribui ao seletor
        let $selfRequest = this.api.get(MyProfilePage.$getProfile).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return; 
            }

            //Adicionando valores a classe user
            this.user._user = resp;
            this.myProfileData = this.user.fillMyProfileData();
            console.log(this.myProfileData);

            //Workaround para parametro de objeto sem acesso direto
            let $vParameter = 'my-videos';

            //Atribui valores ao objeto
            this.myProfileData.videos = resp.metadata[$vParameter];

        }, err => {
            return;
        });

    }

}
