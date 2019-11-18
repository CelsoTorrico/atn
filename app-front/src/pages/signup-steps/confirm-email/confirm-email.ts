import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api } from '../../../providers';

/* Success Class*/
@Component({
    templateUrl: "confirm-email.html"
})
export class ConfirmEmailStepPage {

    title:string
    loadingText:string
    email:string
    status:boolean = false
    count:number = 10

    constructor(
        private navCtrl:NavController, 
        public  translateService: TranslateService,
        alertCtrl: AlertController,
        loading: LoadingController,
        params: NavParams,
        api: Api) { 
        
        //Atribuindo dados de email a válidar
        let verifyEmail   = params.get('verify');
        this.email = verifyEmail.user_email;
    
        //Carregando tradução
        this.translateService.setDefaultLang('pt-br');

        this.translateService.get(['ERROR_EMAIL_VERIFY', 'LOADING']).subscribe((data:any) => {
            this.title          = data.ERROR_EMAIL_VERIFY;
            this.loadingText    = data.LOADING; 
        });   
        
        //Loading
        let load = loading.create({
            content: this.loadingText 
        }) 
        load.present();  

        //Realiza requisição para validar email
        api.post('confirm-email', verifyEmail).subscribe((resp:any) => {
            
            //Fechar loading
            load.dismiss();

            //Se houve erro ou não foi validado
            if(!resp || resp.error != undefined) {                
                
                //Mostrar alerta
                alertCtrl.create({
                    title:   this.title,
                    message: resp.error.confirm_user
                }).present(); 

            } else {   
                //Mostrar conteúdo de sucesso e contador             
                this.counter(); 
            }

        });

    }

    /** Redireciona para a dashboard */
    goToDashboard() {
        this.navCtrl.setRoot('Dashboard');
    }

    //Contador de tempo 
    counter() {

        //Define status de email validado
        this.status = true; 

        let interval = setInterval(() => { 
            this.count--;
            
            if(this.count <= 0) {
                clearInterval(interval);
                this.goToDashboard();
            }

        }, 3600); 
    }

}