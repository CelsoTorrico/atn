import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';


@IonicPage()
@Component({
    selector: 'sports-data',
    templateUrl: 'sports-data.html'
})
export class MyProfileSportsPage {

    public $formacao:any[];

    public mySportsData: any = {
        type:  {
            ID: <number>null
        },
        sport: <any>[],
        clubs: <any>[],
        metadata: {
            weight:{
                value: <string>'',
                visibility: <number>null
            },
            height:{
                value: <string>'',
                visibility: <number>null
            },
            posicao:{
                value: <string>'',
                visibility: <number>null
            },
            formacao: {
                value: <any>[],
                visibility: <number>null
            },
            cursos: {
                value: <string>'',
                visibility: <number>null
            },
            eventos: {
                value: <string>'',
                visibility: <number>null
            },
            club_site:{
                value: <string>'',
                visibility: <number>null
            },
            club_liga:{
                value: <string>'',
                visibility: <number>null
            },       
            club_sede:{
                value: <string>'',
                visibility: <number>null
            }
        }
    };

    //Lista de Esportes
    public $sportSelected = [];    
    protected $sportTable = [];
    protected $sportList = [];

    //Lista de Clubes
    public $clubsSelected = [];    
    protected $clubsTable = [];
    protected $clubsList = [];

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
        let $selfRequest = this.api.get(MyProfileSportsPage.$getProfile).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return; 
            }

            //Adicionando valores a classe user
            this.user._user = resp;
            this.mySportsData = this.user.fillMyProfileData();    
            this.getSportList(); 
            this.getClubsList();            

            //Workaround para parametro de objeto sem acesso direto
            let $vParameter = 'my-videos';

            //Atribui valores ao objeto
            this.mySportsData.videos = resp.metadata[$vParameter];

        }, err => {
            return;
        });

    }

    //REtorna lista de esportes
    getSportList(){
        //Retorna a lista de esportes do banco e atribui ao seletor
        let subscriber = this.api.get('/user/sports').subscribe((resp:any) => {

            //Tabela de Esportes com ID e nome
            this.$sportTable = resp;

            //Lista de apenas nomes de esportes
            this.$sportTable.forEach(element => {
                //[0] = id, [1] = sport_name
                this.$sportList.push(element[1]);
            });     
            
            //Define ID's dos esportes selecionados
            this.$sportTable.forEach(element => {
                this.setChoosed(element, this.mySportsData.sport, 'sport_name','$sportSelected');
            });

        }, err => { 
            return; 
        });
        
    }

    //REtorna lista de esportes
    getClubsList(){
        //Retorna a lista de esportes do banco e atribui ao seletor
        let subscriber = this.api.get('/user/clubs').subscribe((resp:any) => {

            //Tabela de Clubes com ID e nome
            this.$clubsTable = resp;

            //Lista de apenas nomes de clubes
            this.$clubsTable.forEach(element => {
                //[0] = id, [1] = display_name
                this.$clubsList.push(element.display_name);
            });     
            
            //Define ID's dos clubes selecionados
            this.$clubsTable.forEach(element => {
                let arrayItem = ['', element.display_name];
                this.setChoosed(arrayItem, this.mySportsData.clubs, 'club_name','$clubsSelected'); 
            });          

        }, err => { 
            return; 
        });
        
    }

    //Adiciona elementos já selecionados a partir do perfil de usuário
    private setChoosed(item:any, list:any[], compare:string, selected:string) {

        //Intera sobre items
        list.forEach(element => { 
            //Compara valores selecionados com tabela de esportes
            if (element[compare] == item[1]) {
                //Atribui valor a array
                this[selected].push(element[compare]);
            }
        });
    }

}