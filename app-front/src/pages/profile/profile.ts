import { ProfileViewDirective } from './profile-view.directive';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { Api } from './../../providers/api/api';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';
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
    private componentFactoryResolver: ComponentFactoryResolver,
    public translateService: TranslateService) {

    this.translateService.setDefaultLang('pt-br');

    //Tradução
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

    //Retorna id de usuário de contexto
    this.$user_ID = this.params.get('user_id');

    //Verifica se usuário de contexto existe, ou seja, visita a um perfil
    if (this.$user_ID != null && this.$user_ID > 0) {
      //Atribui classe de usuário definido pelo $user_id
      this.user = this.user.getUser(this.$user_ID);
    }

  }


  //Função que inicializa
  ngOnInit() {

    //Quando primeira página de acesso for 'Profile'
    if(this.user._user != undefined ) {
      
      //Verifica se usuário é editavel pelo usuário logado   
      this.isLogged = this.canEdit(true); 
      
      //Popula parametros da classe
      this.populateParameters(); 

    }

    //Quando classe User emitir evento após requisição de dados
    this.user.dataReady.subscribe((resp) => {

      if (resp.status != 'ready') return;
      
      //Popula parametros da classe
      this.populateParameters(); 

    });

  }

  /** Faz a atribuição de dados do perfil de usuário nos parametros da classe */
  private populateParameters() {
    
    //Atribuindo em cada parametro
    this.ID = this.user._user.ID;
    this.following = this.user._user.following;
    this.typeUser = this.user._user.type.ID;

    //Verifica se usuário pertence a equipe 
    this.addedTeam = this.isAddedToTeam();

    this.profileResume.isLogged = this.isLogged; //Injeta visibilidade
    this.profileResume.user = this.user; //Injecta classe
    this.profileResume.loadUserData(this.user._user); //Carrega dados de usuário

    //Carrega componente inicial
    this.loadComponent(this.ListComponents.personalView);

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
    componentRef.instance.user = this.user;
    componentRef.instance.type = this.user._user.type.ID;
    componentRef.instance.loadUserLoadData(this.user._user);

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
  canEdit($valid:boolean = false): boolean {

    //Se usuário estiver logado na propria pagina de perfil
    if ($valid) return true;

    //Verifica se usuário é pertecente ao usuario logado
    return this.myUsers(this.$user_ID);

  }

  /**
   * Verifica se usuário já foi adicionado ao time/clube/instituição
   * @since 2.1
   */
  isAddedToTeam(): boolean {
    //Adicionado dados do usuário que esta visualizando perfil
    return this.myUsers(this.$user_ID);
  }

  /** 
   * Retorna array de ids FALSE 
   * @return mixed  Array de ids ou Bolean para encontrar um id
   * */
  private myUsers($exist: number = null) {

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

    //Se solicitado encontrar um id dentro do array de ids
    if ($exist != null) {
      for (const element of $list.ids) {
        if ($exist == element) {
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
      this.navCtrl.setRoot('Dashboard');
    }
  }


}
