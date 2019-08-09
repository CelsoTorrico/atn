import { environment } from './../environments/environment';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Config, IonicApp, NavController } from 'ionic-angular';
import { User } from '../providers';

@Component({  
  template: `
    <ion-nav #navRoot [root]="rootPage"></ion-nav>
    `
})
export class MyApp { 

  rootPage:string = 'Login'; 

  @ViewChild('navRoot') nav: NavController;

  constructor(
    private translate: TranslateService,
    private config: Config,
    private user: User) {  

    //Iniciar tradução
    this.initTranslate(); 

    /** Verifica se usuário já esta logado anteriormente na plataforma */
    /*this.user.isLoggedUser().then((resp) => {
      //Redireciona para a página de Login
      if (!resp) { 
        //Retorna ativo
        let view = this.nav.getActive();
        if (view.name != 'LoginPage') {
          location.assign(environment.apiOrigin);
        }        
      } 
    });*/

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



}
