import { environment } from './../../environments/environment';
import { Cookie } from './../cookie/cookie';
import { ToastController } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Api } from '../api/api';
import { loadNewPage } from '../load-new-page/load-new-page';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Storage } from '@ionic/storage';

/**
 * User Context
 */
@Injectable()
export class User {

  @Output() dataReady = new EventEmitter();

  //Userdata
  _user: any;

  //Observables
  _userObservable: Observable<ArrayBuffer>;
  _teamObservable: Observable<ArrayBuffer>;
  _statsObservable: Observable<ArrayBuffer>;
  _visibilityObservable: Observable<ArrayBuffer>;

  private filteredData = new Subject<any>();

  private requiredFields: string[] = [
    'display_name', 'gender', 'country', 'user_email', 'cpf', 'rg', 'cnpj', 'type', 'sport'
  ]

  constructor(
    private api: Api,
    protected loadPageService: loadNewPage,
    protected toast: ToastController,
    protected cache: Storage) {

    //Registra observable nas propriedades 
    this.getSelfUserObservable();
    this.getSelfStats();
    this.getTeamMembers();
    this.getSelfVisibility();

    //Quando inicializar a classe fazer requisição e alimentar propriedade _user
    if (Cookie.checkCookie()) { 
      this.getUserData().then((res: boolean) => {
        console.log('User ' + this._user.display_name + ' is ready!');
      });
    }

  }

  /**
   * Função que verifica se usuário tem cookie ativado
   * @since 2.1
   */
  isLoggedUser(): Promise<boolean> {

    //Verifica a existencia do cookie
    return this.api.get('login/cookie').share().toPromise().then((resp: any) => {

      //Se retornar erro, parar execução
      if (!resp || resp.error != undefined) return false;

      //cookie de sessão válido
      return true;

    }, (rej) => {

      //Se retornar erro, parar execução
      return false;

    });

  }

  /**
   * Executa login na plataforma
   */
  login(accountInfo: any): Promise<boolean | void> {

    return this.api.post('login', accountInfo).toPromise().then((res: any) => {
      // Se mensagem contiver parametro 'success'
      if (res.success != undefined) {

        //Exibe sucesso de login
        let message = this.loadPageService.createToast(res.success.login, 'bottom');
        message.present();

        return true;
      }
      else {
        //Exibe erro de login
        let message = this.loadPageService.createToast(res.error.login, 'bottom');
        message.present();

        return false;
      }
    }, err => {
      console.error('LOGIN_ERROR', err);
    });

  }

  /**
   * Log the user out, which forgets the session
   */
  logout():void {

    this.api.get('logout').subscribe((resp:any) => {

      //Remove cookie do browser
      Cookie.deleteCookie();

      //Limpar cache do app/navegador
      this.cache.clear();
      localStorage.clear();

      //Faz o logout
      this.logoutMessageRedirect(resp.success.logout);

    });

  }

  /** Exibe mensagem e redireciona para tela de login */
  private logoutMessageRedirect(resp: string) {

    //Exibe mensagem
    let toast = this.toast.create({
      position: 'bottom',
      message: resp,
      duration: 3000
    });

    toast.present().then((res) => {
      //redirecionar
      window.open(environment.apiOrigin, '_self', 'location=no,clearsessioncache=yes');
    });
  }

  //Executa login via Redes Sociais
  socialLogin(app: string) {
    let req = this.api.getSocial(app);
  }

  /**
   * Registra um novo usuário
   */
  signup(accountInfo: any): Promise<boolean | void> {

    return this.api.post('register', accountInfo).toPromise().then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success != undefined) {

        //Exibe mensagem de cadastro
        let message = this.loadPageService.createToast("Cadastro realizado com sucesso. Bem Vindo a AtletasNOW.", 'bottom');
        message.present();

        //Retorna verdadeiro
        return true;

      } else {
        let $errors: string = '';
        this.requiredFields.forEach(element => {
          //Após confirmação de cadastro redireciona para página de sucesso
          $errors += (res.error[element] != undefined) ? element + ' : ' + res[element] + '\n' : '';
        });

        //Retorna falso
        return false;
      }

    }, err => {
      console.error('ERROR', err);
    });

  }

  /**
   * Atualiza dados de usuário logado
   * @param accountData 
   */
  update(accountData: any, isPhoto: boolean = false):Observable <ArrayBuffer> {

    //Define método de update de dados de usuário
    let method = (isPhoto) ? 'post' : 'put';

    //Retorna observable
    return this.api[method]('user/update', accountData);

  }

  /**
   * Atualizar password do usuário
   */
  setNewPassword(userPass: any) {

    //Retorna observable
    return this.api.put('user/settings/update-password', userPass);

  }

  /** Retorna userObservable como Promise */
  load(): Promise<ArrayBuffer> {
    //Carrega observable
    return this._userObservable.toPromise();
  }

  /** Adiciona dados já recebidos */
  setFilteredData(data) {
    this.filteredData.next(data);
  }

  /**
   * Retorna nova classe User para perfil visualizado usuário requisitado
   */
  getUser($user_id: number): User {

    //Inicializa classe
    let $user = new User(this.api, this.loadPageService, this.toast, this.cache);

    //Retorna observable
    $user._userObservable   = this.api.get('user/' + $user_id).share();
    $user._statsObservable  = this.api.get('user/stats/' + $user_id).share();
    $user._teamObservable   = this.api.get('user/self/club_user/' + $user_id).share();

    //Retorna instancia da classe
    return $user;
  }

  /** Subscribe ao userdata */
  subscribeUser() {

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

  /** Retornar dados de usuario */
  getUserData($optionalFn = ($v) => { }, $component = null): Promise<boolean> {

    return this.load().then((resp: any) => {

      //Se não existir items a exibir
      if (Object.keys(resp).length <= 0 || resp.error != undefined) {
        return false;
      }

      //Adicionando valores a classe user
      this._user = resp;

      //Preenche campos de usuário
      this.fillMyProfileData();

      //Executa função adicional
      $optionalFn($component);

      //Emite evento de dados prontos
      this.dataReady.emit({ status: 'ready' });

      return true;

    }).catch((rej) => {

      return false;

    });

  }

  /**
   * Retorna observable usuário logado
   */
  private getSelfUserObservable(): Observable<ArrayBuffer> {

    //Setando Observable
    return this._userObservable = this.api.get('user/self').share();

  }

  /**
   * Retorna observable usuário logado
   */
  private getSelfStats(): Observable<ArrayBuffer> {

    //Retorna observable
    return this._statsObservable = this.api.get('user/stats').share();

  }

  /**
   * Retorna observable usuário logado
   */
  private getTeamMembers(): Observable<ArrayBuffer> {

    //Retorna observable
    return this._teamObservable = this.api.get('user/self/club_user').share();

  }

  /**
   * Permite definir a página de membros da equipe retornando observable
   * @since 2.1
   */
  public getTeamMembersByPage($paged:number): Observable<ArrayBuffer> {

    //Retorna observable
    return this._teamObservable = this.api.get('user/self/club_user/'+ this._user.ID + '/paged/'+ $paged).share();
  }

  //Retorna observable de visibilidade
  private getSelfVisibility(): Observable<ArrayBuffer> {

    //Retorna observable
    return this._visibilityObservable = this.api.get('timeline/visibility').share();

  }

  //Define os campos definidos para o usuário
  private fillMyProfileData() {

    //Retorna campos por tipo de usuaŕio
    let campos = this.userLoggedFields();
    let userclass = this;

    //Percorre array de campos e adiciona valores para os campos de usuários necessário, 
    //incluindo os que não forem preenchidos
    campos.forEach(function (value, index, array) {

      //Atribui campos requeridos com dados vazios a elemento da classe
      if (userclass.requiredFields.indexOf(value) > -1 && !userclass._user.metadata[value]) {
          
          //Definindo atributo para arquivar campos requiridos
          if (!userclass._user.empty) userclass._user.empty = [];
          
          //Atribui campos faltantes
          userclass._user.empty.push(value);
      }     

      //Atribui dados de cada metadado a classe
      userclass._user.metadata[value] = {
        value: (userclass._user.metadata[value] != undefined) ? userclass._user.metadata[value].value : null,
        visibility: (userclass._user.metadata[value] != undefined) ? userclass._user.metadata[value].visibility : 0
      }

    }, userclass);

    //Adiciona a variavel global
    return userclass._user;

  }

  /**
   * Retorna campos especificos para cada usuário
   */
  private userLoggedFields() {

    //Campos gerais
    let $fields: string[] = [
      'city', 'state', 'country', 'neighbornhood', 'zipcode', 'telefone', 'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography', 'user_email', 'user_status', 'sport', 'clubes'
    ]

    //Se usuário não tiver tipo definido, definir como usuário padrão
    if (!this._user.type) {
      
      //Atribui perfil default para não quebrar a aplicação
      this._user.type = { ID: 1, type: 'Atleta' };

      //Adicionando o campo requerido porém não preenchido
      this._user.empty = ['type'];
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

    //Profissional do Esporte
    if (this._user.type.ID == 2) {
      let arr: string[] = ['career'];
      Array.prototype.push.apply($fields, arr);
    }

    //Retorna array
    return $fields;

  }


}
