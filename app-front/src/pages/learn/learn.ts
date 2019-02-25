import { DashboardPage } from '../dashboard/dashboard';
import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
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
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        private params: NavParams ) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Adicionando enviadors da view anterior
        //this.currentUserData = this.params.get('currentUser');

        //Define requisiçaõ para mostrar dados
        if(this.currentUserData == undefined) {
            //Intancia componente dashboard para retornar dados de usuário
            //TODO: Fazer a obtenção de dados logado via Service
            
        }

    }

}
