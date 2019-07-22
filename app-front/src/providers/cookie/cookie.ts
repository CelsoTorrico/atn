import { NavController } from 'ionic-angular';
import { CookieService } from 'ng2-cookies';
import { Injectable } from '@angular/core';

@Injectable()
export class Cookie {

  constructor() {} 

  static checkCookie(cookie:CookieService, nav:NavController):boolean {

    //Se cookie de sessão já estiver setado direcionar para dashboard
    let existsCookie = cookie.check('app_atletas_now');  

    //Se cookie da plataforma estiver presente direcionar para dashboard
    /*if(!existsCookie){
      //Redirecionar para página de login
      nav.setRoot(LoginPage);        
    }*/

    //Retorna boolean
    return existsCookie; 

  }

}
