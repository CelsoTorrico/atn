import { NavController } from 'ionic-angular';
import { SuccessStep } from './../../pages/signup-steps/success/success';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { loadNewPage } from '../load-new-page/load-new-page';
import { DashboardPage } from '../../pages/dashboard/dashboard';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  
  _user: any;

  private navCtrl:any;
  private requiredFields:string[] = [
    'display_name', 'gender', 'country', 'user_email', 'cpf', 'rg', 'cnpj'
  ]

  constructor(
    private api: Api,
    private loadPageService: loadNewPage ) {}

  
  /** Implementa variavel com controlador de navegação */
  injectNavCtrl(navComponent:NavController){
    this.navCtrl = navComponent;
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    
    let seq = this.api.post('login', accountInfo);
    
    seq.subscribe((res: any) => {
      // Se mensagem contiver parametro 'success'
      if (res.success != undefined) {
        //Registra sucessp de login
        this._loggedIn(res);

        //Redireciona para página dashboard
        this.loadPageService.getPage(res, this.navCtrl, DashboardPage);            
      }
      else{
        //Exibe erro de login
        this.loadPageService.getPage(res.error.login, this.navCtrl, null);             
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  socialLogin(app: string) {
    
    let seq = this.api.getSocial('login/' + app);

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    
    let seq = this.api.post('register', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success != undefined) {
        this._loggedIn(res);
        
        //Após confirmação de cadastro redireciona para página de sucesso
        this.loadPageService.getPage(res, this.navCtrl, SuccessStep); 
      }
      else{
        let $errors:string = '';
        this.requiredFields.forEach(element => {
            res.error.forEach(el => {
              //Após confirmação de cadastro redireciona para página de sucesso
              $errors += (el[element] != undefined)? element + ' : ' + el[element] + '\n':'';  
            });
            
        });
        this.loadPageService.getPage($errors, this.navCtrl, 'bottom');
      }
      
    }, err => {
        console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.success;
  }

}
