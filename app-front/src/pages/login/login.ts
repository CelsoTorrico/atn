import { ForgetPasswordComponent } from './forget-password.component';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { User, Cookie } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'login.html'
})

export class LoginPage implements OnInit{
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
  private loadingMessage:string;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public loading: LoadingController,
    public modal: ModalController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.setDefaultLang('pt-br'); 
    this.translateService.get(['LOGIN_ERROR', 'LOADING']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.loadingMessage = value.LOADING;
    })

  }

  ngOnInit(){
    /** Verifica se usuário já esta logado anteriormente na plataforma */
    this.user.isLoggedUser().then((resp) => {
      //Redireciona para a página de Dashboard
      if (resp) { 
        this.navCtrl.setRoot('Dashboard');
      } 
    }); 
  }

  // Realiza login comum via email e senha 
  doLogin(form: NgForm) {
    
    //Se formulário estiver inválido, mostrar mensagem
    if (form.status == 'INVALID') {
        this.$error = 'Preencha os campos de email e senha!';
        return;
    }

    //Inicializa loading
    let loading = this.loading.create({ content: 'Loading'});
    loading.present();

    //Envia dados ao servidor
    this.user.login(this.account).then(($resp:boolean) => { 
      
      //Se login efetuado com sucesso e cookie setado com sucesso
      if($resp == true) { 
          
        //Redireciona para dashboard
        this.user.getUserData().then((resp:boolean) => {
          
          if(!resp){
            //Fecha loading
            loading.dismiss();
            return;
          } 

          //Rediciona para dashboard
          this.navCtrl.setRoot('Dashboard').then((resp) => {
            loading.dismiss();
          }); 

        });        

      }

      //Fecha loading
      loading.dismiss();

    }).catch((rej) => {
      
      //Feha loading
      loading.dismiss(); 

      //Exibe erro de login
      this.$error = this.loginErrorString;

    });    

  }  

  //Realiza login via Facebook
  loginFb() {
    //Realiza login
    this.user.socialLogin('facebook');  
  }

  //Realiza login vi Google
  loginGoogle() {
    //Realiza login
    this.user.socialLogin('google');
  }

  //Redireciona para etapas de registro
  goToRegister() {
    this.navCtrl.push('Register');  
  }

  //Abrir modal de Esqueci Minha Senha 
  openForgetPass(){
    let modal = this.modal.create(ForgetPasswordComponent);
    modal.present()
  }

}
