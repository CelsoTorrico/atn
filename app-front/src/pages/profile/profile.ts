import { ProfileViewDirective } from './profile-view.directive';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api } from './../../providers/api/api';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Platform } from 'ionic-angular';
import { User, Cookie } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';
import { ChatPage } from '../chat/chat';
import { CookieService } from 'ng2-cookies';

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
    statsView: StatsComponent
  }

  //Variveis de template de usuario

  //Current logged user
  currentUser: User;
  ID: number = null; 
  display_name: string = null;
  favorite:boolean = false;
  following:boolean = false;
  isLogged:boolean = false;

  //Profile visited
  public $user_ID: number = null;

  public showMessageBox: boolean = false;

  public loginErrorString;

  constructor(
    public  navCtrl: NavController,
    public  modalCtrl: ModalController,
    private api: Api,
    public  user: User,
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

  //Função para carregar componentes 
  loadComponent($component = ProfileComponent) {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory($component);

    let viewContainerRef = this.profileView.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.
      createComponent(componentFactory);

    //Injeta classe de usuário no componente filho
    componentRef.instance.isLogged  = this.isLogged;
    componentRef.instance.profile   = this.currentUser._userObservable;
    componentRef.instance.stats     = this.currentUser._statsObservable; 
    componentRef.instance.team_members   = this.currentUser._teamObservable; 

    //Se component for stats envia observable 
    if(StatsComponent == componentRef.componentType){
      
    } 
    
  }

  //Mudar a visualização de componentes
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


}
