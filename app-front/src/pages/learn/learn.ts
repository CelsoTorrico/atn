import { CookieService } from 'ng2-cookies';
import { DashboardPage } from '../dashboard/dashboard';
import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
    segment: 'learn:id',
})
@Component({
  selector: 'learn',
  templateUrl: 'learn.html'
})
export class LearnPage { 

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

    public loginErrorString;
  
    constructor(
        public  navCtrl: NavController,
        public  user: User,
        public  api: Api,
        public  toastCtrl: ToastController,
        private params: NavParams,
        public  translateService: TranslateService,
        private cookieService: CookieService) { 

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        });

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

    ngOnInit() {
        this.user.dataReady.subscribe((resp) => {

            if(resp.status != 'ready') return;

            //Adicionando enviadors da view anterior
            this.currentUserData = this.params.get('currentUser');
        })
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
