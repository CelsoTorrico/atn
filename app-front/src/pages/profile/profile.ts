import { style } from '@angular/core/src/animation/dsl';
import { ProfileViewDirective } from './profile-view.directive';
import { ProfileResumeComponent } from './../components/profile-resume/profile.resume.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api } from './../../providers/api/api';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Platform } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileComponent } from './profile-components/profile.component';
import { StatsComponent } from './profile-components/stats.component';

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

  ID: number = null; 

  public $user_ID: number;

  public showMessageBox: boolean = false;

  public loginErrorString;

  constructor(
    public navCtrl: NavController,
    private api: Api,
    public user: User,
    public translateService: TranslateService,
    private params: NavParams,
    private browser: InAppBrowser,
    private componentFactoryResolver: ComponentFactoryResolver,
    private platform: Platform) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    //Adicionando enviadors da view anterior
    this.$user_ID = this.params.get('user_id');

    //Define requisiçaõ para mostrar dados
    if (this.$user_ID != undefined) {
      //Adiciona url para exibir perfis de conexão
      this.user.getUser(this.$user_ID);
    }

  }

  //Função que inicializa
  ngOnInit() {

    //Carrega componente
    this.loadComponent();

  }

  

  ngAfterViewInit() {
    this.platform.ready().then((readySource) => {
      if(this.platform.width() < 600){
          
          let resume = document.querySelector('.profile-resume');
        
          //Adicionar popup ao elemento para sobrepor header
          let page = document.querySelector('.scroll-content');
          //Inserir elemento como primeiro
          page.insertBefore(resume, page.childNodes[0]);

          page.style.marginTop = '0px';
      }
    });
  }

  //Função para carregar componentes 
  loadComponent($component = ProfileComponent) {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory($component);

    let viewContainerRef = this.profileView.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.
      createComponent(componentFactory);
  }

  //Mudar a visualização de componentes
  changeComponentView($event) {
    //Atribui dado proveninete da classe filho
    this.loadComponent(this.ListComponents[$event]);
  }

  
  /** Funções de botões */

  followProfile($event) {

    $event.preventDefault();
    console.log(this);

    //Adiciona Id do usuário corrente
    let $id = this.ID;

    //Começar ou deixar de seguir profile
    this.api.get('follow/' + $id).subscribe((resp: any) => {

      if (resp.success != undefined) {
        let el = $event.target.parentNode;
        if (el.classList.contains("active")) {
          el.classList.remove("active");
          el.classList.add("inactive");
        } else {
          el.classList.add("active")
          el.classList.remove("inactive");
        }
      }
    });
  }

  downloadProfilePDF() {

    //Adiciona Id do usuário corrente
    let $id = this.ID;

    //Adiciona url (dev|prod)
    let $url = this.api.getUrl() + '/user/pdf/';

    //Abre uma nova aba para download
    this.browser.create($url + $id, '_blank');
  }

  sendProfileMessage() {
    //Abre e fecha box de mensagem
    if (this.showMessageBox) {
      this.showMessageBox = false;
    } else {
      this.showMessageBox = true;
    }
  }


}
