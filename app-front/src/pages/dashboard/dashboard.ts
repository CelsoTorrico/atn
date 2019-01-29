import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User, Api } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html' 
})
export class DashboardPage { 

    public loginErrorString;
    public currentUserData:any = {
        ID: '',
        display_name: '',
        metadata: {
            profile_img: {
               value: '' 
            }
        }
    };
  
    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService ) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }
    
    //Função que inicializa
    ngOnInit() {
        this.currentUser();
    }

    public currentUser(){ 

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.user._user = this.api.get('user/self').subscribe((resp:any) => {

            //Se não existir items a exibir
            if(resp.length <= 0){
                return;
            }
            
            //Adicionando valores a variavel global
            this.currentUserData = resp;
  
        }, err => { 
            return; 
        });

        return this.currentUserData;

    }

    //Abre uma nova página de profile
    goToPage($page:string, $data:any){
        this.navCtrl.push($page, {currentUser: $data}); 
    }

}
