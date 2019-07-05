import { ProfileViewDirective } from './profile-view.directive';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api } from './../../providers/api/api';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Platform, AlertController } from 'ionic-angular';
import { User, Cookie } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';
import { ChatPage } from '../chat/chat';
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

  //Variveis de template de usuario

  //Current logged user
  currentUser: User;
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
    public user: User,
    private params: NavParams,
    private browser: InAppBrowser,
    private componentFactoryResolver: ComponentFactoryResolver,
    public translateService: TranslateService,
    private cookieService: CookieService) {

    this.translateService.setDefaultLang('pt-br');

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    //Adicionando enviadors da view anterior
    this.$user_ID = this.params.get('user_id');

    //Define requisiçaõ para mostrar dados
    if (this.$user_ID != undefined) {
      //Atribui classe de usuário definido pelo $user_id
      this.currentUser = this.user.getUser(this.$user_ID);
    }
    else {
      //Atribui classe do usuário logado
      this.currentUser = this.user;
      this.isLogged = true;
    }

    //Retorna dados do usuário
    this.currentUser.subscribeUser(function ($this) {

      //Funções realizadas após requisição com dados sucesso
      $this.ID = $this.currentUser._user.ID;
      $this.profile_name = $this.currentUser._user.profile_name;
      $this.following = $this.currentUser._user.following;
      $this.typeUser = $this.currentUser._user.type.ID;

      //Se for uma instituição
      if ($this.currentUser._user.type.ID > 3 && $this.$user_id != undefined) {
        //Verifica se usuário pertence a instituição
        $this.isAddedToTeam();
      }

    }, this);

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

  ngAfterViewInit() {

  }

  /** Função para carregar componentes  */
  loadComponent($component = ProfileComponent) {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory($component);

    let viewContainerRef = this.profileView.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.
      createComponent(componentFactory);

    //Injeta classe de usuário no componente filho
    componentRef.instance.isLogged = this.isLogged;
    componentRef.instance.profile = this.currentUser._userObservable;
    componentRef.instance.stats = this.currentUser._statsObservable;
    componentRef.instance.team_members = this.currentUser._teamObservable;

    //Se component for stats envia observable 
    if (StatsComponent == componentRef.componentType) {

    }

  }

  /** Mudar a visualização de componentes */
  changeComponentView($event) {
    //Atribui dado proveninete da classe filho
    this.loadComponent(this.ListComponents[$event]);
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


  /**
   * Verifica se usuário já foi adicionado ao time/clube/instituição
   * @since 2.1
   */
  private isAddedToTeam() {

    //Adicionado dados do usuário que esta visualizando perfil
    let $listUser = this.currentUser._user.current_users;
    console.log($listUser);

    //Verifica se id do usuário pertence em lista
    $listUser.ids.find(function (element, index, array) {
      console.log(element);
      //Verifica se usuário existe no time
      if (element == this.$user_ID) {
        this.addedTeam = true;
      }

    });

  }


}
