import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'favorite',
  templateUrl: 'favorite.html'
})
export class FavoritePage {
  
    item: any;

    public $ID:number;

    public currentUserData:any = {
        ID: '',
        display_name: '',
        sport: '', 
        metadata: {
            profile_img: {
                value: '' 
            },
            formacao:{
                value:'' 
            }
        },
        videos: []
    };

    public static getFavoriteUrl:string  = 'favorite';
    public static getSuggestionsUrl:string = 'user/suggestions';

    public favoriteMembers:any = {
        Atletas: [],
        Clubes: [],
        Outros: []
    };

    public followersMembers:any; 

    public friendsSuggestion:any = {
        found: [],
        success: {
            criterio: []
        }
    };

    public loginErrorString;
  
    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        private params: NavParams, 
        public translateService: TranslateService) { 
    
            this.translateService.setDefaultLang('pt-br');

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Adicionando enviadors da view anterior
        this.currentUserData = this.params.get('currentUser');

        //Define requisiçaõ para mostrar dados
        if(this.currentUserData == undefined) {
            //Intancia componente dashboard para retornar dados de usuário
            //TODO: Fazer a obtenção de dados logado via Service
        }

    }

    //Função que inicializa
    ngOnInit() {
        this.getFavoriteMembers();
        this.getFriendsSuggestions();
    }


    private getFavoriteMembers(){    
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get(FavoritePage.getFavoriteUrl).subscribe((resp:any) => {        
            //Retorna array de membros
            this.favoriteMembers = resp;
        }, err => { 
            return; 
        });
    }

    private getFriendsSuggestions(){
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get(FavoritePage.getSuggestionsUrl).subscribe((resp:any) => { 
            
            if (resp.success == undefined || resp.found == undefined || resp.found.lenght <= 0) {
                return;
            }

            //Retorna array de membros  
            this.friendsSuggestion = resp;

        }, err => { 
            return; 
        });
    }   

}
