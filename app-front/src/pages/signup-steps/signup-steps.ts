import { SignupStepsService } from './signup-steps.service';
import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular'; 
import { TranslateService } from '@ngx-translate/core';
import { ProfileType } from './profile-type/profile-type';
import { NgForm } from '@angular/forms';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup-steps.html'  
})

export class SignupStepsPage {  

    public $account = { 
        display_name:   <string>'', 
        user_email:     <string>'', 
        user_pass:      <string>'',
        confirm_pass:   <string>''
    };
    
    public $error:string = '';
  
    constructor(
        private nav:NavController,
        public service: SignupStepsService,
        public alertCtrl: AlertController, 
        public translateService: TranslateService) {     
            this.translateService.setDefaultLang('pt-br');
        } 

    /* Função de inicialização */
    ngOnInit() {
        // ...
    }

    /** Função para o botão de Login, vai a view de login*/
    goToLogin(){
        this.nav.push(LoginPage);         
    }
  
    /** Função que verifica dados existente e abre nova view (etapa2)*/ 
    goToNext(form:NgForm) {

        //Se formulário estiver inválido, mostrar mensagem
        if (form.status == 'INVALID') {
            this.$error = 'Por favor, preencha todos campos solicitados!'; 
            return;
        }

        //Adicionando objeto a var
        let $userData = this.$account;

        if($userData.user_pass.length == 0 || $userData.confirm_pass.length == 0) {
            return this.showAlert('Campos de senhas estão vazios.');
        }

        if($userData.user_pass != $userData.confirm_pass) {
            return this.showAlert('Senha não confere.');
        }
        
        //Se true, dados existentes
        /*if( this.service.checkIfExistUser($userData) ){  
            return this.showAlert("Usuário já existe. Faça o login!"); 
        }*/

        //Carrega a próxima View passando os dados preencheidos
        this.nav.push(ProfileType, $userData);
    }

    private showAlert($msg){
        
        const alert = this.alertCtrl.create({
            title: $msg,
            buttons: ['OK']
        });

        return alert.present();
    }

}