import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { SignupStepsPage } from '../signup-steps/signup-steps';
import { NgForm } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'login.html'
})

export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { user_email: string, user_pass: string } = {
    user_email: '',
    user_pass:  ''
  };

  public $form = document.getElementById("loginForm");
  public $error:string;

  // Our translated text strings
  private loginErrorString: string;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

  }

  ngOnInit() {
    //Se cookie de sessão já estiver setado direcionar para dashboard
  }

  // Realiza login comum via email e senha 
  doLogin(form: NgForm) {
    
    //Se formulário estiver inválido, mostrar mensagem
    if (form.status == 'INVALID') {
        this.$error = 'Preencha os campos de email e senha!';
        return;
    }

    ///Injeta classe com nav controller
    this.user.injectNavCtrl(this.navCtrl);

    //Envia dados ao servidor
    this.user.login(this.account);   
  }  

  //Realiza login via Facebook
  loginFb() {
    //Injeta classe com nav controller
    this.user.injectNavCtrl(this.navCtrl);

    //Realiza login
    this.user.socialLogin('facebook');  
  }

  //Realiza login vi Google
  loginGoogle(){
    //Injeta classe com nav controller
    this.user.injectNavCtrl(this.navCtrl);

    //Realiza login
    this.user.socialLogin('google');
  }

  goToRegister(){
    this.navCtrl.push(SignupStepsPage); 
  }

}
