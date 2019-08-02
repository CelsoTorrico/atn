import { CookieService } from 'ng2-cookies';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class Cookie {

  constructor() {} 

  /** Verifica existencia cookie */
  static checkCookie():boolean {
    return (new CookieService).check(environment.cookieName);  
  }

  /** Retorna dados do cookie */
  static getCookie() {
    return (new CookieService).get(environment.cookieName);
  }

  /** Remover cookie */
  static deleteCookie() {
    return (new CookieService).delete(environment.cookieName);
  }

}
