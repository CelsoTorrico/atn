import { ToastController } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';
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

  @Output() dataReady = new EventEmitter();

  _user: any;
  _userObservable: Observable<ArrayBuffer>;
  _teamObservable: Observable<ArrayBuffer>;
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
    this.getUserData().then((res) => {

    });
    
    this.getSelfStats();
    this.getTeamMembers();
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

        //Exibe mensagem de cadastro
        let message = this.loadPageService.createToast("Cadastro realizado com sucesso. Bem Vindo a AtletasNOW.", 'bottom');
        message.present();

        //Após confirmação de cadastro redireciona para página de sucesso
        this.loadPageService.getPage(res, this.navCtrl, DashboardPage);
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
  update(accountData: any, isPhoto: boolean = false) {

    //Define método de update de dados de usuário
    let method = (isPhoto) ? 'post' : 'put';

    //Retorna observable
    let observable = this.api[method]('user/update', accountData);

    return observable;
  }

  /**
   * Atualizar password do usuário
   */
  setNewPassword(userPass: any) {

    //Retorna observable
    let observable = this.api.put('user/settings/update-password', userPass);

    return observable;

  }

  /**Retornar dados de usuario */
  getUserData(): Promise<void> {

    let observable = this.getSelfUserObservable();

    return observable.toPromise().then(
      (resp: any) => {

        //Se não existir items a exibir
        if (Object.keys(resp).length <= 0) {
          return;
        }

        //Adicionando valores a classe user
        this._user = resp;

        //Preenche campos de usuário
        this.fillMyProfileData();

      }).catch((reason) => {
        this.dataReady.emit('Dados de usuário carregado.');
      });

  }

  /**
   * Retorna observable usuário logado
   */
  private getSelfUserObservable(): Observable<ArrayBuffer> {

    //Setando Observable
    return this._userObservable = this.api.get('user/self');

  }

  /**
   * Retorna observable usuário logado
   */
  private getSelfStats(): Observable<ArrayBuffer> {

    //Retorna observable
    return this._statsObservable = this.api.get('user/stats');

  }

  /**
   * Retorna observable usuário logado
   */
  private getTeamMembers(): Observable<ArrayBuffer> {

    //Retorna observable
    return this._teamObservable = this.api.get('user/self/club_user');

  }

  //Retorna observable de visibilidade
  private getSelfVisibility(): Observable<ArrayBuffer> {

    //Retorna observable
    return this._visibilityObservable = this.api.get('timeline/visibility');

  }

  /**
   * Retorna classe User para perfil visualizado usuário requisitado
   */
  getUser($user_id: number): User {

    //Inicializa classe
    let $user = new User(this.api, this.loadPageService, this.toast);

    //Retorna observable
    $user._userObservable = this.api.get('user/' + $user_id);
    $user._statsObservable = this.api.get('user/stats/' + $user_id);
    $user._teamObservable = this.api.get('user/self/club_user/' + $user_id);

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
  subscribeUser($optionalFn = function ($v) { }, $component = null) {

    function requestUserData(user) {

      let observers = [];

      return (observer) => {

        observers.push(observer);

        if (observers.length === 1) {

          user._userObservable.subscribe((resp) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
              return;
            }

            //Adicionando valores a classe user
            user._user = resp;

            //Preenche campos de usuário
            user.fillMyProfileData();

            //Executa função adicional
            $optionalFn($component);

          });

        }

        return {
          unsubscribe() {
            // Remove from the observers array so it's no longer notified
            observers.splice(observers.indexOf(observer), 1);
            // If there's no more listeners, do cleanup
            if (observers.length === 0) {

            }
          }
        };

      }
    }

    let source = new Observable(requestUserData(this));

    source.subscribe();

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
      'city', 'state', 'country', 'neighbornhood', 'zipcode', 'telefone', 'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography', 'user_email', 'sport', 'clubes'
    ]

    //Se usuário não tiver tipo definido, definir como usuário padrão
    if (this._user.type == null) {
      this._user.type = { ID: 1, type: 'Atleta' }
    }

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
