import { CookieService } from 'ng2-cookies';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class Cookie {

  constructor() {} 

  /** Verifica existencia cookie */
  static checkCookie($name:string = environment.cookieName):boolean {
    return (new CookieService).check($name);  
  }

  /** Retorna dados do cookie */
  static getCookie($name:string = environment.cookieName) {
    return (new CookieService).get($name);
  }

  /** Remover cookie */
  static deleteCookie($name:string = undefined) {
    return ($name == undefined)? (new CookieService).deleteAll('/', environment.domain) : (new CookieService).delete($name, '/', environment.domain) ;
  }

  /** Setar cookie */
  static setCookie($name:string, $value:string) {
    return (new CookieService).set($name, $value, 90000, '/', environment.domain, environment.socketSecure);
  }

}
