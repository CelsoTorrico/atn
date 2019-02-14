import { NavController, ToastController } from 'ionic-angular';
import { SuccessStep } from './../../pages/signup-steps/success/success';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { loadNewPage } from '../load-new-page/load-new-page';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { Observable } from 'rxjs/Observable';

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
  _userObservable:  Observable<ArrayBuffer>;
  _statsObservable: Observable<ArrayBuffer>;

  private navCtrl: any;

  private requiredFields: string[] = [
    'display_name', 'gender', 'country', 'user_email', 'cpf', 'rg', 'cnpj'
  ]

  constructor(
    private api: Api,
    private loadPageService: loadNewPage,
    private toast: ToastController) {
       //Carrega Observables
      this.getSelfUser();
      this.getSelfStats();
    }

  /** Implementa variavel com controlador de navegação */
  injectNavCtrl(navComponent: NavController) {
    this.navCtrl = navComponent;
  }

  /**
   * Executa login na plataforma
   */
  login(accountInfo: any) {

    let seq = this.api.post('login', accountInfo);

    seq.subscribe((res: any) => {
      // Se mensagem contiver parametro 'success'
      if (res.success != undefined) {
        //Registra sucesso de login
        this._loggedIn(res);

        //Redireciona para página dashboard
        this.loadPageService.getPage(res, this.navCtrl, DashboardPage);
      }
      else {
        //Exibe erro de login
        this.loadPageService.getPage(res.error.login, this.navCtrl, null);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  //Executa login via Redes Sociais
  socialLogin(app: string) {
    let seq = this.api.getSocial('login/' + app);
    return seq;
  }

  /**
   * Registra um novo usuário
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
      else {
        let $errors: string = '';
        this.requiredFields.forEach(element => {
          res.error.forEach(el => {
            //Após confirmação de cadastro redireciona para página de sucesso
            $errors += (el[element] != undefined) ? element + ' : ' + el[element] + '\n' : '';
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
   * Atualiza dados de usuário logado
   * @param accountData 
   */
  update(accountData: any) {

    let seq = this.api.put('user/update', accountData);

    seq.subscribe((res: any) => {
      // Se mensagem contiver parametro 'success'
      if (res.success != undefined) {

        //Redireciona para página dashboard
        let message = this.toast.create({
          message: res.success.register,
          position: "bottom",
          showCloseButton: true
        });

        message.present();

      }
      else {
        //Exibe erro de atualização
        let message = this.toast.create({
          message: res.error.register,
          position: "bottom",
          showCloseButton: true
        });

        message.present();

      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Retorna observable usuário logado
   */
  private getSelfUser(): Observable<ArrayBuffer> {

    //Retorna os dados de usuário e atribui ao seletor
    return this._userObservable = this.api.get('user/self');

  }

  /**
   * Retorna observable usuário logado
   */
  private getSelfStats(): Observable<ArrayBuffer> {

    //Retorna os dados de usuário e atribui ao seletor
    return this._statsObservable = this.api.get('user/stats');

  }

  /**
   * Retorna observable de usuário requisitado
   */
  getUser($user_id:number):User {

    //Atribui observable
    this._userObservable  = this.api.get('user/' + $user_id);
    this._statsObservable = this.api.get('user/stats/' + $user_id);

    //Retorna instancia da classe
    return this;
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

  /** Subscribe ao userdata */
  subscribeUser($optionalFn = null, $component = null) {
    return this._userObservable.subscribe(
      (resp:any) => {

        //Se não existir items a exibir
        if (resp.length <= 0) {
          return;
        }

        //Adicionando valores a classe user
        this._user = resp;
        this.fillMyProfileData();

        //Executa função adicional
        $optionalFn($component);

      },
      (error) => {

      });
  }

  //Define os campos definidos para o usuário
  fillMyProfileData() {

    //Retorna campos por tipo de usuaŕio
    let campos = this.userLoggedFields();
    let userdata = this._user;

    //Percorre array de campos e adiciona valores para os campos de usuários necessário, 
    //incluindo os que não forem preenchidos
    campos.forEach(function (value, index, array) {
      userdata.metadata[value] = {
        value: (userdata.metadata[value] != undefined) ? userdata.metadata[value].value : null,
        visibility: (userdata.metadata[value] != undefined) ? userdata.metadata[value].visibility : 0
      }
    }, userdata);

    //Adiciona a variavel global
    return userdata;

  }

  /**
   * Retorna campos especificos para cada usuário
   */
  private userLoggedFields() {

    //Campos gerais
    let $fields: string[] = [
      'telefone', 'city', 'state', 'country', 'neighbornhood', 'zipcode', 'telefone', 'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography', 'user_email'
    ]

    //Se usuario for atleta e profissional
    if (this._user.type.ID == (1 || 2)) {
      let arr: string[] = ['birthdate', 'gender', 'rg', 'cpf', 'formacao', 'cursos', 'parent_user'];
      Array.prototype.push.apply($fields, arr);
    }

    //Compartilhado entre Faculdade e Clube
    if (this._user.type.ID == (3 || 4 || 5)) {
      let arr: string[] = ['cnpj', 'eventos', 'meus-atletas', 'club_site', 'club_liga', 'club_sede'];
      Array.prototype.push.apply($fields, arr);
    }

    //Compartilhado entre Atleta e Clube
    if (this._user.type.ID == (1 || 3 || 4 || 5)) {
      let arr: string[] = ['empates', 'vitorias', 'derrotas', 'titulos', 'jogos', 'titulos-conquistas'];
      Array.prototype.push.apply($fields, arr);
    }

    //Atleta
    if (this._user.type.ID == 1) {
      let arr: string[] = ['weight', 'height', 'posicao', 'stats', 'stats-sports'];
      Array.prototype.push.apply($fields, arr);
    }

    //Retorna array
    return $fields;

  }


}
