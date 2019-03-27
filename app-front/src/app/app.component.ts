import { Component, ViewChild, enableProdMode } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Config, Platform, Nav } from 'ionic-angular';
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
    platform: Platform, 
    settings: Settings, 
    private config: Config) {

    //Definindo a linguagem default do app
    this.translate.setDefaultLang('pt-br');
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
    
    this.initTranslate();
    
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('pt-br');
    const browserLang = this.translate.getBrowserLang();

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

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

}
