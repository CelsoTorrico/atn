import { ProfileViewDirective } from './profile-view.directive';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api } from './../../providers/api/api';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { User, Cookie } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';
import { CookieService } from 'ng2-cookies';
import { DashboardPage } from '../dashboard/dashboard';
import { ClubComponent } from './profile-components/club.component';

@IonicPage()
@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  @ViewChild(ProfileViewDirective) profileView: ProfileViewDirective;
  @ViewChild(ProfileResumeComponent) profileResume: ProfileResumeComponent;
  @ViewChild(ProfileComponent) profileChild: ProfileComponent;

  private ListComponents: any = {
    personalView: ProfileComponent,
    statsView: StatsComponent,
    clubView: ClubComponent
  }

  //Usuário de contexto
  currentUser: User;

  //Usuário logado
  loggedUser: any;

  //Variveis de template de usuario
  ID: number = null;
  display_name: string = null;
  favorite: boolean = false;
  following: boolean = false;
  isLogged: boolean = false;
  typeUser: number = null;
  addedTeam: boolean = false;

  //Profile visited
  public $user_ID: number = null;

  public showMessageBox: boolean = false;

  public loginErrorString;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private api: Api,
    private user: User,
    private params: NavParams,
    private browser: InAppBrowser,
    private componentFactoryResolver: ComponentFactoryResolver,
    public translateService: TranslateService,
    private cookieService: CookieService) {

    this.translateService.setDefaultLang('pt-br');

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    //Retorna id de usuário de contexto
    this.$user_ID = this.params.get('user_id');

    //Verifica se usuário de contexto existe, ou seja, visita a um perfil
    if (this.$user_ID) {
      
      //Atribui classe de usuário definido pelo $user_id
      this.currentUser  = this.user.getUser(this.$user_ID);
      this.loggedUser   = this.user._user;

      //Retorna dados do usuário
      this.currentUser.subscribeUser(function ($this) {

        //Funções realizadas após requisição com dados sucesso
        $this.ID = $this.currentUser._user.ID;
        $this.following = $this.currentUser._user.following;
        $this.typeUser = $this.currentUser._user.type.ID;

        //Verifica se usuário é editavel pelo usuário logado
        $this.isLogged = $this.canEdit();

        //Verifica se usuário pertence a equipe
        $this.addedTeam =  $this.isAddedToTeam();

      }, this);

    } else {
      //Atribui dados (User) do usuário logado em formato array
      this.currentUser = this.user;
      
      this.user.getUserData().then(() => {
        
        //Atribuindo dados de usuário logado
        this.loggedUser = this.user._user;

        //Atribuindo em cada parametro
        this.ID = this.loggedUser.ID;
        this.following = this.loggedUser.following;
        this.typeUser = this.loggedUser.type.ID;

        //Verifica se usuário é editavel pelo usuário logado
        this.isLogged = this.canEdit();

        //Verifica se usuário pertence a equipe
        this.addedTeam =  this.isAddedToTeam();

      });     

    }

  }

  ionViewDidLoad() {
    //Verifica existência do cookie e redireciona para página
    Cookie.checkCookie(this.cookieService, this.navCtrl);
  }

  //Função que inicializa
  ngOnInit() {
    //Carrega componente
    this.loadComponent();
  }

  /** Função para carregar componentes  */
  loadComponent($component = ProfileComponent) {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory($component);

    let viewContainerRef = this.profileView.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.
      createComponent(componentFactory);

    //Injeta classe de usuário no componente filho
    componentRef.instance.isLogged      = this.isLogged;
    componentRef.instance.profile       = this.currentUser._userObservable;
    componentRef.instance.stats         = this.currentUser._statsObservable;
    componentRef.instance.team_members  = this.currentUser._teamObservable;

  }

  /** Mudar a visualização de componentes */
  changeComponentView($event) {
    //Atribui dado proveninete da classe filho
    this.loadComponent(this.ListComponents[$event]);
  }

  /** 
   * Função de permitir a exibição dos botões de edição 
   * @since 2.1
   * */
  canEdit(): boolean {

    //Se usuário estiver logado em propria conta
    if (this.isLogged) {
      return true;
    }

    return this.myUsers(this.$user_ID);

  }

  /**
   * Verifica se usuário já foi adicionado ao time/clube/instituição
   * @since 2.1
   */
  isAddedToTeam():boolean {
    //Adicionado dados do usuário que esta visualizando perfil
    return this.myUsers(this.$user_ID);
  }

  /** 
   * Retorna array de ids FALSE 
   * @return mixed  Array de ids ou Bolean para encontrar um id
   * */
  private myUsers($exist:number = null) {

    //Se não existir parametro
    if (this.loggedUser.current_users == (undefined || null) ) {
      return false;
    }

    //Array de ids de membros pertencetes a instituição
    let $list = this.loggedUser.current_users;

    //verifica se existe quantidade
    if ($list.qtd <= 0) {
      return false;
    }

    //Se solicitado encontrar um id dentro do array de ids
    if ($exist != null) {
      for (const element of $list.ids) {
        if ( $exist == element ) {
          $list = true;
          break;
        }
      }
    }

    //Retorna array de ids
    return $list;

  }



  /** --------------------------------------------------
   * Funções de botões 
   * */

  /** Seguir */
  followProfile($event) {

    $event.preventDefault();

    //Adiciona Id do usuário corrente
    let $id = this.ID;

    //Começar ou deixar de seguir profile
    this.api.get('follow/' + $id).subscribe((resp: any) => {

      if (resp.success != undefined) {
        let el = $event.target.parentNode;
        if (el.classList.contains("active")) {
          el.classList.remove("active");
          el.classList.add("inactive");
          this.following = false;
        } else {
          el.classList.add("active")
          el.classList.remove("inactive");
          this.following = true;
        }
      }
    });
  }

  /** Donwload Currículo */
  downloadProfilePDF() {

    //Adiciona Id do usuário corrente
    let $id = this.ID;

    //Adiciona url (dev|prod)
    let $url = this.api.getUrl() + '/user/pdf/' + $id;

    return $url;

  }

  /** Enviar Mensagem */
  sendChatMessage() {

    //Adiciona Id do usuário corrente
    let $id = this.ID;

    //Iniciar uma sala de chat
    this.navCtrl.push('ChatPage', {
      room_open: $id
    });

  }

  /** Envia mensagem */
  sendProfileMessage() {
    //Abre e fecha box de mensagem
    if (this.showMessageBox) {
      this.showMessageBox = false;
    } else {
      this.showMessageBox = true;
    }
  }

  /** Função de adicionar  */
  addToTeam($event) {

    $event.preventDefault();

    //Adiciona Id do usuário corrente
    let $id = this.ID;

    let $alert = this.alertCtrl.create({
      title: 'Adicionar usuário a sua equipe?',
      message: 'Tem certeza que deseja realizar essa ação?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Sim',
        handler: data => {
          //Começar ou deixar de seguir profile
          this.api.get('user/add_team/' + $id).subscribe((resp: any) => {
            if (resp.success != undefined) {
              //Mudar status do botão
              this.addedTeam = (this.addedTeam) ? false : true;
            }
          });
        }
      }]
    });

    $alert.present();

  }

  /* Abre uma nova página */
  backButton() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(DashboardPage);
    }
  }


}
