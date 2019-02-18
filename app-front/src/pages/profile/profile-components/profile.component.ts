import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User, Api } from '../../../providers';
import { MyProfilePersonalDataComponent } from '../../my-profile/personal-data/personal-data.component';
import { MyProfileSportsComponent } from '../../my-profile/sports-data/sports-data.component';
import { ProfileMessage } from '../profile-message.component';
import { MyProfileStatsComponent } from '../../my-profile/stats-data/stats-data.component';

@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfileComponent {

  //Variveis de template de usuario

  ID: number = null;

  type: number = null;

  display_name: string = '';

  sport: any = {
    value: []
  }

  clubes: any = {
    value: []
  }

  biography: any = {
    value: ''
  }

  birthdate: any = {
    value: ''
  }

  address: any = {
    value: ''
  }

  city: any = {
    value: ''
  }

  country: any = {
    value: ''
  }

  state: any = {
    value: ''
  }

  cpf: any = {
    value: ''
  }

  rg: any = {
    value: ''
  }

  gender: any = {
    value: ''
  }

  neighbornhood: any = {
    value: ''
  }

  telefone: any = {
    value: ''
  }

  profile_img: any = {
    value: ''
  }

  formacao: any = {
    value: ''
  }

  cursos: any = {
    value: ''
  }

  ['titulos-conquistas'] = {
      value: ''
  }

  videos: any = []

  public $user_ID: number;

  public $getUser: any;

  public loginErrorString;

  public showMessageBox: boolean = false;

  private ListComponents: any = {
    personalData  : MyProfilePersonalDataComponent,
    sportsData    : MyProfileSportsComponent,
    videosData    : MyProfileStatsComponent,
    statsData     : MyProfileStatsComponent
  }

  constructor(
    public navCtrl: NavController,
    public user: User,
    public api: Api,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    public translateService: TranslateService,
    private params: NavParams,
    private browser: InAppBrowser,
    private domSanitizer: DomSanitizer) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

  }

  //Função que inicializa
  ngOnInit() {

    //Carrega dados do usuário de contexto
    this.currentUser();

  }

  ionViewWillEnter(): void {

  }

  private currentUser() {

    this.user._userObservable.subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Adicionando valores as variavel global
      let atributes = resp;
      //Adicionando dados para serem usados em components

      if (atributes.metadata != undefined) {
        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in atributes.metadata) {
          if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
            this[key] = atributes.metadata[key];
          }
        }
      }

      if (resp.metadata['my-videos'] != undefined) {

        if (resp.metadata['my-videos'].value.length <= 0)
          return;

        let videos: any[] = [];

        //Percorre array de links de video, sanitizando e atribuindo
        resp.metadata['my-videos'].value.forEach(element => {
          //Atribui valores ao objeto
          let embed = element.replace('watch?v=', 'embed/');
          let trustedVideo = this.domSanitizer.bypassSecurityTrustResourceUrl(embed);
          videos.push(trustedVideo);
        });

        //Adiciona videos a variavel de escopo global
        this.videos = videos;
      }

      //Atribuindo dados aos modelos
      this.ID = atributes.ID;
      this.display_name = atributes.display_name;
      this.type = atributes.type.ID;
      this.sport = atributes.sport;
      this.clubes = atributes.clubs;

    }, err => {
      return;
    });
  }

  //Abrir modal com dados para atualizar perfil
  editData($component:string){

    //Criar modal do respectivo component
    let modal = this.modalCtrl.create(this.ListComponents[$component], {});
    
    //Inicializar modal
    modal.present();

  }

}
