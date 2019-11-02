import { Api } from './../providers/api/api';
import { Cookie } from './../providers/cookie/cookie';
import { environment } from './../environments/environment';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Config, IonicApp, NavController } from 'ionic-angular';
import { User } from '../providers';

@Component({  
  template: `
    <ion-nav #navRoot [root]="rootPage"></ion-nav>    
    <ion-footer>
      <profile-databox *ngIf="hasRequiredEmpty" (requiredFormSubmited)="hideProfileRequired()"></profile-databox>
    </ion-footer>    
    `
})
export class MyApp { 

  rootPage:string = 'Login';
  view:any;
  private floatbox:any; 
  public hasRequiredEmpty:boolean = false;

  @ViewChild('navRoot') nav: NavController;

  constructor(
    private translate: TranslateService,
    private config: Config,
    private user: User,
    private api: Api) {  

    //Iniciar tradução
    this.initTranslate(); 

    /** Verifica se usuário já esta logado anteriormente na plataforma */
    this.user.isLoggedUser().then((resp:any) => {      
      
      //Retorna view da página atual
      this.view = this.nav.getActive();

      if (!resp) { 
        
        //Páginas permitidas sem cookie
        let canPages:any = ['LoginPage', 'SignupStepsPage'];
        
        //Percorre array e verifica, se false redireciona para home
        canPages.forEach(element => {
          if (this.view.name != element) {            
            
            //Remove cookie
            Cookie.deleteCookie();

            //Redireciona para home
            this.view.willEnter.subscribe((resp) => {
              this.nav.setRoot('Login');
            });
          }  
        });       
              
      } else {
        //Redireciona para dashboard
        if(this.view.name == 'LoginPage') {
          this.nav.setRoot('Dashboard');
        }
      }

    });


    //Verifica se usuário está inativado e exibe caixa flutuante
    this.user.dataReady.subscribe(() => {
      
      //Mostrar floatbox para autenticação de email
      if (this.user._user != undefined && this.user._user.user_status == 1) {
        
        //Query de elementos para inserção em html
        let collection = document.getElementsByTagName('ION-APP') as HTMLCollectionOf <HTMLElement>;
        let app = collection.item(0); 
        this.floatbox = document.getElementById("validate-email");

        if(!app.contains(this.floatbox)) {
          
          //Setando a floatbox com atributos e html
          this.floatbox = document.createElement("div");
          this.floatbox.setAttribute("id","validate-email");
          this.floatbox.classList.add("float-box");
          this.floatbox.innerHTML = "<p>É necessário autenticar seu email.</p><a icon-end='' ion-button='' outline='' small='' ng-reflect-small='' ng-reflect-outline='' class='button button-md button-outline button-outline-md button-small button-small-md'><span class='button-inner'>Valide agora mesmo</span><div class='button-effect' style='transform: translate3d(-2px, -63px, 0px) scale(1); height: 153px; width: 153px; opacity: 0; transition: transform 338ms ease 0s, opacity 236ms ease 102ms;'></div></a>";

          //Adicionando evento ao botão filho do alerta
          let button = this.floatbox.lastChild as HTMLElement;
          button.setAttribute("onclick", 'this.validateEmail()');
          button.onclick = () => { this.validateEmail() };

          //Adicionado elemento a página
          app.appendChild(this.floatbox);
        }      

      }

      //Redirecionar para página de profile em caso de campos obrigatórios não preenchidos
      if (this.user._user != undefined && (this.user._user.empty.indexOf('type') > -1 || this.user._user.empty.indexOf('sport') > -1 ))
      { 
          //Atribui se houver dados de usuário definido como faltantes
          this.hasRequiredEmpty = true;
      }      

    });    

  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('pt-br');
    const browserLang = this.translate.getBrowserLang();

    this.translate.get('BACK_BUTTON_TEXT').subscribe(data => {
      this.config.set('ios', 'backButtonText', data);
    });

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('pt-br'); // Set your language here
    }

  }

  /** Esconde componente  */
  hideProfileRequired() {
    //Atribui se houver dados de usuário definido como faltantes
    this.hasRequiredEmpty = false;
  }

  /** Função que envia email de verificação à usuário logado */
  validateEmail() {
    
    this.api.get('user/validate').subscribe((data:any) => {
      
      if(data == null || data == false) return;
      
      if(data.error != undefined) {
        return;
      }

      //Atribuindo html do floatbox
      this.floatbox.innerHTML = "<p><i>Enviamos um email com link de autenticação para você.</i></p>";

    });
  }

}
