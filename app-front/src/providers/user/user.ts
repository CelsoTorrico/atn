import { ToastController } from 'ionic-angular';
import { SuccessStep } from './../../pages/signup-steps/success/success';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { loadNewPage } from '../load-new-page/load-new-page';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

/**
 * User Context
 */
@Injectable()
export class User {

  _user: any;
  _userObservable: Observable<ArrayBuffer>;
  _statsObservable: Observable<ArrayBuffer>;
  _visibilityObservable: Observable<ArrayBuffer>;

  private filteredData = new Subject<any>();
  private navCtrl: any;

  private requiredFields: string[] = [
    'display_name', 'gender', 'country', 'user_email', 'cpf', 'rg', 'cnpj'
  ]

  constructor(
    private api: Api,
    protected loadPageService: loadNewPage,
    protected toast: ToastController) {
    
    //Carrega Observables
    this.getSelfUser();
    this.getSelfStats();
    this.getSelfVisibility();
  }

  /** Implementa variavel com controlador de navegação */
  injectNavCtrl(navComponent) {
    this.navCtrl = navComponent;
  }

  /** Adiciona dados já recebidos */
  setFilteredData(data) {
    this.filteredData.next(data);
  }

  /**
   * Executa login na plataforma
   */
  login(accountInfo: any) {

    let seq = this.api.post('login', accountInfo);

    seq.subscribe((res: any) => {
      // Se mensagem contiver parametro 'success'
      if (res.success != undefined) {

        //Exibe erro de login
        let message = this.loadPageService.createToast(res.success.login, 'bottom');
        message.present();

        //Redireciona para página dashboard
        this.navCtrl.push(DashboardPage);
      }
      else {
        //Exibe erro de login
        let message = this.loadPageService.createToast(res.error.login, 'bottom');
        message.present();
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  //Executa login via Redes Sociais
  socialLogin(app: string) {
    let req = this.api.getSocial(app);
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
          //Após confirmação de cadastro redireciona para página de sucesso
          $errors += (res.error[element] != undefined) ? element + ' : ' + res[element] + '\n' : '';
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
  update(accountData: any, isPhoto:boolean = false) {

    //Define método de update de dados de usuário
    let method = (isPhoto)? 'post' : 'put';

    let seq = this.api[method]('user/update', accountData);

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

  //Retorna observable de visibilidade
  private getSelfVisibility(): Observable<ArrayBuffer> {

    //Retorna a lista de visibilidades do usuário
    return this._visibilityObservable = this.api.get('timeline/visibility');

  }

  /**
   * Retorna classe User para perfil visualizado usuário requisitado
   */
  getUser($user_id: number): User {

    //Atribui observable
    let $user = new User(this.api, this.loadPageService, this.toast);
    $user._userObservable =  this.api.get('user/' + $user_id);
    $user._statsObservable = this.api.get('user/stats/' + $user_id);

    //Retorna instancia da classe
    return $user;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout(): Observable<ArrayBuffer> {

    //Reseta dados do usuário na variavel
    this._user = null;

    //Define Observable
    let logout = this.api.get('logout');

    //Retorna observable
    return logout;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.success;
  }

  /** Subscribe ao userdata */
  subscribeUser($optionalFn = function($v){}, $component = null) {
    return this._userObservable.subscribe(
      (resp: any) => {

        //Se não existir items a exibir
        if (Object.keys(resp).length <= 0) {
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
  private fillMyProfileData() {

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
      'telefone', 'city', 'state', 'country', 'neighbornhood', 'zipcode', 'telefone', 'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography', 'user_email', 'sport', 'clubes'
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
