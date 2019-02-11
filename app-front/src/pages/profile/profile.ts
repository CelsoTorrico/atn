import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  //Variveis de template de usuario

  ID:number = null;

  type:number = null;

  display_name:string = '';
  
  sport:any = {
    value: []
  }

  clubes:any = {
    value: []
  }

  biography:any = {
    value:''
  }
  
  birthdate:any ={
    value:''
  }

  address:any ={
    value:''
  }

  city:any ={
    value:''
  }

  country:any ={
    value:''
  }

  state:any ={
    value:''
  }

  cpf:any ={
    value:''
  }

  rg:any ={
    value:''
  }

  gender:any ={
    value:''
  }

  neighbornhood:any ={
    value:''
  }

  telefone:any ={
    value:''
  }

  profile_img:any ={
    value: ''
  }

  formacao:any ={
    value: ''
  }

  cursos:any ={
    value: ''
  }

  ['titulos-conquistas'] = {
    value:''
  }
  
  videos:any = []

  public $user_ID: number;

  public favoriteMembers: any[];

  public $getUser:any;

  public loginErrorString;

  private $getProfile: string = 'user/self';

  public showMessageBox: boolean = false;

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

    //Adicionando enviadors da view anterior
    this.$user_ID = this.params.get('user_id');

    //Define requisiçaõ para mostrar dados
    if (this.$user_ID != undefined) {
      //Adiciona url para exibir perfis de conexão
      this.$getProfile = 'user/' + this.$user_ID;
    }

    //Retorna a lista de esportes do banco e atribui ao seletor
    this.$getUser = this.api.get(this.$getProfile);

  }

  //Função que inicializa
  ngOnInit() {

    //Carrega dados do usuário de contexto
    this.currentUser();

    //Somente exibe favoritos para usuário logado
    if (this.$user_ID == undefined)
      this.getFavoriteMembers();

  }

  ionViewWillEnter(): void {
      
  }

  private currentUser() {

    this.$getUser.subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Adicionando valores as variavel global
      let atributes = resp;
      //Adicionando dados para serem usados em components
      
      if(atributes.metadata != undefined){
         //Intera sobre objeto e atribui valor aos modelos de metadata
          for (var key in atributes.metadata) {
            if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
                this[key] = atributes.metadata[key];
            }
        }
      }  
      
      if (resp.metadata['my-videos'] != undefined) {

        if(resp.metadata['my-videos'].value.length <= 0)
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

  private getFavoriteMembers() {
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.user._user = this.api.get('favorite').subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Adicionando valores a variavel global
      this.favoriteMembers = resp;

    }, err => {
      return;
    });
  }

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
