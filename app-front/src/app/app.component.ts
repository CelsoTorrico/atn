import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'ionic-angular';
import { Settings } from '../providers';
import { LoginPage } from '../pages/login/login';

@Component({
  template: `
    <ion-nav #content [root]="rootPage"></ion-nav>  
    `
})
export class MyApp {

  rootPage = LoginPage;

  constructor(
    private translate: TranslateService,
    settings: Settings,
    private config: Config) {

    //Iniciar tradução
    this.initTranslate();

    //Requisita permissão de notificação inicial
    this.requestDesktopNotificationPermission();

  }

  // Adicionar/Permissão permissão para notificações via browser
  requestDesktopNotificationPermission() {

    /*this.swPush.requestSubscription({
      serverPublicKey: "BPcMbnWQL5GOYX/5LKZXT6sLmHiMsJSiEvIFvfcDvX7IZ9qqtq68onpTPEYmyxSQNiH7UD/98AUcQ12kBoxz/0s="
    }).then(sub => {
      console.log(sub);
    }).catch(err => console.error("Could not subscribe to notifications", err));*/
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
