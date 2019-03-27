import { Injectable } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { LoginPage } from '../../pages/login/login';
import { Api } from '../api/api';

@Injectable()
export class Cookie {

  constructor() {} 

  static checkCookie(cookie, nav):boolean {
    
    //Se cookie de sessão já estiver setado direcionar para dashboard
    let existsCookie = cookie.check('app_atletas_now'); 

    //Se cookie da plataforma estiver presente direcionar para dashboard
    if(existsCookie){
      //Não tem como verificar se cookie está expirado, portanto no momento somente direcionar 
      if(nav.getActive().name == 'LoginPage') 
        nav.push(DashboardPage); 
    } else {
      //Redirecionar para página de login
      if(nav.getActive().name != 'LoginPage')  
        location.assign(Api.origin);  
    }

    //Retorna boolean
    return existsCookie; 

  }

}
