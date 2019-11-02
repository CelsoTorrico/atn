import { ProfileViewDirective } from './profile-view.directive';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { Api } from './../../providers/api/api';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';
import { ClubComponent } from './profile-components/club.component';
import { Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment.prod';

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

  //Define como visitante externo
  siteVisitor:boolean = true;

  //Dados de Usuário de contexto
  loggedUser: any = {
    ID: <number>null,
    type: {
      ID: <number>null
    }
  }

  //Duas instancias de usuário
  profileUser: User
  currentUser: User

  //Variveis de template de usuario
  ID: number = null;
  display_name: string = null;
  favorite: boolean = false;
  following: boolean = false;
  isLogged: boolean = false;
  typeUser: number = 1;
  addedTeam: boolean = false;

  //Profile visited
  public $user_ID: number = null;

  public showMessageBox: boolean = false;

  public loginErrorString;

  public title: any;

  loading:Loading;

  loadingMessage:string;

  constructor(
    public  navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public  modalCtrl: ModalController,
    public  alertCtrl: AlertController,
    private api: Api,
    private user: User,
    private params: NavParams,
    private componentFactoryResolver: ComponentFactoryResolver,
    public  translateService: TranslateService,
    private meta: Meta) {

    this.translateService.setDefaultLang('pt-br');

    //Tradução
    this.translateService.get(['LOGIN_ERROR', 'LOADING', 'ADD_USER_TO_CLUB', 'REMOVE_USER_TO_CLUB']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.title = {
        REMOVE_USER_TO_CLUB: value.REMOVE_USER_TO_CLUB,
        ADD_USER_TO_CLUB: value.ADD_USER_TO_CLUB
      };
      this.loadingMessage = value.LOADING;
    });

    //Inicializando loading
    this.loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });

    //Retorna id de usuário de contexto
    this.$user_ID = this.params.get('user_id');

  }

  ionViewWillLoad() {
    
    /** Verifica se usuário já esta logado anteriormente na plataforma */
    this.user.isLoggedUser().then((resp:any) => {

      //Setando informações do usuário de contexto
      this.setCurrentUser();  

      //Carrega dados do perfil visitado
      this.setProfileUser(); 

    });

  }

  //Função que inicializa
  ngOnInit() {

    this.loading.present();

  }

  //Carrega informações do perfil visualizado
  private setProfileUser() {
      
      //Verifica se usuário de contexto existe, ou seja, visita a um perfil
      if (this.$user_ID > 0 ) {

        //Atribui classe de usuário definido pelo $user_id
        this.profileUser = this.user.getUser(this.$user_ID);

        //Carregar dados do Open Graph quando dados de usuário forem carregados
        this.profileUser.dataReady.subscribe((r) => {
          this.addMetaTags();
        });

        //Carrega dados de usuário do perfil
        this.profileUser.getUserData().then((resp:any) => {

          if(!resp) return;

          //Popula parametros da classe
          this.currentUser = this.profileUser;

          //Caso usuário logado seja mesmo que perfil visitado
          if(this.loggedUser.ID == this.$user_ID) {
            //Verifica se usuário é editavel pelo usuário logado   
            this.isLogged = true;
          }
          
          //Popular dados no perfil
          this.populateParameters(this.profileUser);

        });

      }

  }

  //Setando informações do usuário de contexto
  private setCurrentUser() {  

    //Se instanciado anteriormente com usuário de contexto
    if (this.user._user != undefined) {

      this.loggedUser   = this.user._user; //seta como usuário logado
      this.siteVisitor  = false; //Seta se é usuario que visita perfil

    } else {
      this.user.dataReady.subscribe((resp) => {

        if (resp.status != 'ready') return;

        //Carrega usuário de contexto
        this.setCurrentUser();

      });

    }

  }

  /** Faz a atribuição de dados do perfil de usuário nos parametros da classe */
  private populateParameters($user:User = this.user) {

    //Atribuindo em cada parametro
    this.ID = $user._user.ID;
    this.following  = $user._user.following;
    this.typeUser   = $user._user.type.ID;

    //Verifica se usuário pertence a equipe 
    this.addedTeam = this.isAddedToTeam($user._user.ID);

    this.profileResume.isLogged = this.isLogged; //Injeta visibilidade
    this.profileResume.user = $user; //Injecta classe
    this.profileResume.loadUserData($user._user); //Carrega dados de usuário

    //Carrega componente inicial
    this.loadComponent(this.ListComponents.personalView);

    //Fecha loading
    this.loading.dismiss();

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
    componentRef.instance.user = this.currentUser;
    componentRef.instance.type = this.currentUser._user.type.ID;
    componentRef.instance.loadUserLoadData(this.currentUser._user);

  }

  /** Mudar a visualização de componentes */
  changeComponentView($event) {
    //Atribui dado proveninete da classe filho
    this.loadComponent(this.ListComponents[$event]);
  }

  /** Recarregar dados no resumo após update */
  reloadResume() {
    this.profileResume.loadUserData(this.user.getUserData()); //Carrega dados de usuário
  }

  /** 
   * Função de permitir a exibição dos botões de edição 
   * @since 2.1
   * */
  canEdit($valid: boolean = false): boolean {
    //Se usuário estiver logado na propria pagina de perfil
    return $valid;
  }

  /**
   * Verifica se usuário já foi adicionado ao time/clube/instituição
   * @since 2.1
   */
  isAddedToTeam($id: number): boolean {
    //Adicionado dados do usuário que esta visualizando perfil
    return this.myUsers($id);
  }

  /** 
   * Retorna array de ids FALSE 
   * @return mixed  Array de ids ou Bolean para encontrar um id
   * */
  private myUsers($id: number): boolean {

    //Se não existir parametros
    if(this.user == (undefined || null) || this.user._user == (undefined || null)) {
      return false;
    }

    //Se não existir parametro
    if (this.user._user.current_users == (undefined || null)) {
      return false;
    }

    //Array de ids de membros pertencetes a instituição
    let $list = this.user._user.current_users;

    //verifica se existe quantidade
    if ($list.qtd <= 0) {
      return false;
    }

    //Resposta da função
    let resp: boolean = false;

    //Se solicitado encontrar um id dentro do array de ids
    for (const memberID of $list.ids) {
      if ($id == Number(memberID)) {
        resp = true;
        break;
      }
    }

    //Retorna array de ids
    return resp;

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
    this.navCtrl.push('Chat', {
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
      title: (this.addedTeam) ? this.title.REMOVE_USER_TO_CLUB : this.title.ADD_USER_TO_CLUB,
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

              //Recarrega dados de usuário logado na classe user
              this.user.getUserData();
            }
          });
        }
      }]
    });

    $alert.present();

  }

  /** Função de adicionar metatags Open Graph de acordo com perfil de usuário */
  addMetaTags() {
    
    //Opengraph
    this.meta.updateTag({ property: 'og:url', content: environment.apiOrigin +'/#/profile/'+ this.$user_ID });
    this.meta.updateTag({ property: 'og:type', content: 'profile' });
    this.meta.addTag({ property: 'og:profile:first_name', 
    content: this.profileUser._user.display_name });

    //Se existir metadado de Imagem de Perfil
    if(this.profileUser._user.metadata.profile_img) {
      this.meta.updateTag({ property: 'og:image', content: this.profileUser._user.metadata.profile_img.value });
    }
    
    //Se existir metadado de Gênero (Atletas e Profissionais)
    if(this.profileUser._user.metadata.gender) {
      this.meta.addTag({ property: 'og:profile:gender', content: this.profileUser._user.metadata.gender.value });
    }        
    
  }

  /**
   * Abrir modal para compartilhar link do perfil 
   * @param $event 
   */
  shareProfile($event) {
    
    $event.preventDefault();

    this.alertCtrl.create({
      title:    'Compartilhar Perfil',
      subTitle: 'Copie e compartilhe em suas redes',
      cssClass: 'share-alert',
      inputs: [
        {
          id: 'share-input',
          name: 'profile_url',
          value: location.href,
          type: 'text',
          disabled: true
        }
      ],
      buttons: [{
        text: 'Copiar',
        role: null,
        handler: data => {
          let $textarea = document.createElement('textarea');
          $textarea.style.position = 'fixed';
          $textarea.style.left = '0';
          $textarea.style.top = '0';
          $textarea.style.opacity = '0';
          $textarea.value = location.href;
          document.body.appendChild($textarea);
          $textarea.focus();
          $textarea.select();
          document.execCommand('copy');
          document.body.removeChild($textarea);
        }
      },{
        text: 'Cancelar',
        role: 'cancel'
      }]
    }).present();

  }

  /* Volta página anterior */
  backButton() {
    if (this.navCtrl.canSwipeBack()) {
      this.navCtrl.getPrevious();
    } else {
      this.navCtrl.setRoot('Dashboard');
    }
  }

  //Direciona para a página de Login
  goLogin() {
    this.navCtrl.setRoot('Login');
  }


}
