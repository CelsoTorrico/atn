import { ClubList } from './../../../providers/clubs/clubs';
import { Component, Input } from '@angular/core';
import { ViewController, NavParams, LoadingController, NavController, ToastController, ModalController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User, Api } from '../../../providers';
import { NgForm } from '@angular/forms';
import { profileTypeList } from '../../../providers/profiletypes/profiletypes';
import { MyProfileSportsComponent } from '../sports-data/sports-data.component';
import { VisibilityList } from '../../../providers/visibility/visibility';
import { SportList } from '../../../providers/sport/sport';

@Component({
    selector: 'team-data-edit',
    templateUrl: 'team-data.html'
})
export class MyProfileAddMemberDataComponent extends MyProfileSportsComponent {

    page_title:string = "ADD_NEW_MEMBER";

    $user_id: number

    display_name: string

    user_email: string

    user_pass:string

    confirm_pass:string

    type:number = 1;

    sport: any[] = []

    sportSelected:any

    //Url de requisição de usuário
    private static readonly $getProfile: string = 'user/self/club_user'
    
    private method:string = 'post'

    public loginErrorString

    public loading_placeholder

    //Lista de tipos de usuário
    public $typeUserList:any;
    
    //Lista de Esportes
    public $sportsSelected = [];
    protected $sportTable = [];
    protected $sportListClub = [];

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        private alert: AlertController,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public modal: ModalController,
        public translateService: TranslateService,
        public visibilityList: VisibilityList,
        public sportList: SportList,
        public clubList: ClubList,        
        private loading: LoadingController,
        params: NavParams,
        profileType: profileTypeList) { 

        //Extendendo classe SportsComponent
        super(navCtrl, user, api, toastCtrl, viewCtrl, modal, translateService, visibilityList, sportList, clubList);
    
        this.translateService.setDefaultLang('pt-br');

        this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
            this.loading_placeholder    = data.LOADING;
        });

        //Atribuindo lista de usuários
        this.$typeUserList = profileType.list;

        //Zerando lista de esportes
        this.$sportList = [];
        
        //Atribuindo lista de esportes disponíveis baseado no clube
        for (const element of this.user._user.sport) {
            this.$sportListClub.push(element.sport_name);    
        }

        //Data de usuário
        this.$user_id = params.get('data');

    }

    //Função que inicializa
    ngOnInit() {
        
        //No caso de editar usuário
        if(this.$user_id != undefined){
            
            //Atribui classe de usuário
            let user = this.user.getUser(this.$user_id);

            //Faz requisição de dados de usuário
            user.dataReady.subscribe((resp:any) => {

                //Sem resposta retorna
                if (resp.status != 'ready') return;

                //Atribuindo dados aos modelos
                this.page_title     = "UPDATE_MEMBER";
                this.method         = "put";
                this.display_name   = user._user.display_name;
                this.user_email     = user._user.user_email;
                this.type           = user._user.type.ID;
                this.sport          = user._user.sport; 
                
                //Atribuindo os esportes anteriores do usuário, assim permitindo remover e adicionar novamente.
                this.sport.forEach(element => {
                    this.$sportListClub.push(element.sport_name); 
                });       
                
                //Define os esportes selecionados
                this.savedSportList();

            });
        }

    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Loading
        const loading = this.loading.create({ 
            content: this.loading_placeholder 
        });

        loading.present();

        //Define ID's dos esportes selecionados
        this.sport = [];
        this.$sportsSelected.forEach(element => {
            this.setChooseSports(element);
        });

        //Campos válidos
        let saveFields = {
            display_name: null,
            user_email: null,
            user_pass: null,
            confirm_pass: null,
            type: null,   
            //sport: null        
        }

        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in saveFields) {
            if (this.hasOwnProperty(key) && this[key] != undefined) {
                saveFields[key] = this[key];
            }
        }

        //Se for update, adicionar ID de usuário
        let url = (this.$user_id != undefined)? '/' + this.$user_id : '';
        let method = this.method;

        //Realiza update de dados do usuario
        this.api[method](MyProfileAddMemberDataComponent.$getProfile + url, saveFields).subscribe((resp:any) => {
            
            if(resp.error != undefined) {
                
                //Mostrar alerta de erro
                let alert = this.alert.create({
                    message: resp.error
                });

                alert.present();
                return;
            }

            //Fechar tela de loading
            loading.dismiss();

            //Fechar modal e passar data para pai
            this.dismiss(resp); 

        });
    }

    //Fechar modal e passar dados obtidos
    dismiss($data:any = null){
        this.viewCtrl.dismiss($data);
    }

}
