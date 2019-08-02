import { MyProfileCalendarComponent } from './../../my-profile/calendar-data/calendar-data.component';
import { MyProfileAddMemberDataComponent } from './../../my-profile/team-data/team-data.component';
import { MyProfileVideosComponent } from './../../my-profile/videos-data/videos-data.component';
import { Component, Input } from '@angular/core';
import { NavController, ToastController, ModalController, Alert, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User, Api } from '../../../providers';
import { MyProfilePersonalDataComponent } from '../../my-profile/personal-data/personal-data.component';
import { MyProfileSportsComponent } from '../../my-profile/sports-data/sports-data.component';
import { MyProfileStatsComponent } from '../../my-profile/stats-data/stats-data.component';

@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfileComponent {

  //Variveis de template de usuario

  @Input() user: User

  @Input() type: number = null;

  isLogged: boolean = false;

  ID: number = null;

  display_name: string = '';

  sport: any = null

  clubes: any = null

  biography: any = null

  birthdate: any = null

  address: any = null

  city: any = null

  country: any = null

  state: any = null

  cpf: any = null

  rg: any = null

  gender: any = null

  neighbornhood: any = null

  telefone: any = null

  profile_img: any = null

  formacao: any = null

  career: any = null

  cursos: any = null;

  ['titulos-conquistas'] = null

  videos: any = null

  /* Instituição */

  team: any = null

  max_users: number = null;

  current_users: {
    ids: [''],
    qtd: 0
  }

  club_site: any = null

  club_sede: any = null

  club_liga: any = null

  eventos: any = null

  /** FIM */

  public loginErrorString;

  public showMessageBox: boolean = false;

  public deleteMessage: any;

  private ListComponents: any = {
    personalData: MyProfilePersonalDataComponent,
    sportsData: MyProfileSportsComponent,
    videosData: MyProfileVideosComponent,
    statsData: MyProfileStatsComponent,
    teamData: MyProfileAddMemberDataComponent,
    calendarData: MyProfileCalendarComponent
  }

  constructor(
    public navCtrl: NavController,
    public api: Api,
    public toastCtrl: ToastController,
    public alert: AlertController,
    public modalCtrl: ModalController,
    public domSanitizer: DomSanitizer,
    public translateService: TranslateService) {

    this.translateService.setDefaultLang('pt-br');

    this.translateService.get(["YOU_WILL_EXCLUDE_MEMBER", "YOU_SURE"]).subscribe((data) => {
      this.deleteMessage = data;
    })

  }

  //Função que inicializa
  ngOnInit() {
    
  }

  /** Carrega dados de usuário de contexto */
  public loadUserLoadData(userdata:any, $fn = () => {}) {
    return this.currentUserLoadData(userdata, $fn); 
  }

  /** Recarrega dados após atualização */
  public reloadUserData(){
    this.user.getUserData().then((resp:boolean) => {
        
      if (!resp) return;
      this.loadUserLoadData(this.user._user, function(){
        console.log('Dados recarregados!')
      });

    });
  }

  /** carrega dados de usuário */
  private currentUserLoadData(userdata:any, $fn = () => {}) {

    let atributes = userdata;

    //Intera sobre objeto e atribui valor aos modelos de metadata
    if (atributes.metadata != undefined) { 
      for (const key in atributes.metadata) {

        let attr = atributes.metadata[key];
        let value = (attr.hasOwnProperty('value')) ? attr.value : attr;

        //Percorre array de metadatas e atribuindo a propriedades da classe
        if (this.hasOwnProperty(key) && value != null) {
          this[key] = value;
        }

      }
    }

    //Atribuindo dados aos modelos
    this.ID = atributes.ID;
    this.display_name = atributes.display_name;

    if (atributes.type != null) this.type = atributes.type.ID;
    if (atributes.sport != null) this.sport = atributes.sport;
    if (atributes.clubs != null) this.clubes = atributes.clubs;

    //Apenas para instituições
    if (this.type > 3) {

      //Atribui data
      this.current_users = atributes.current_users;
      this.max_users = atributes.max_users;

      //executa busca de membros da instituição
      this.getMyMembersTeam(); 

    }

    if (atributes.metadata['my-videos'] && atributes.metadata['my-videos'].value) {

      if (atributes.metadata['my-videos'].value.length <= 0)
        return;

      let videos: any[] = [];

      //Percorre array de links de video, sanitizando e atribuindo
      atributes.metadata['my-videos'].value.forEach(element => {
        //Atribui valores ao objeto
        let embed = element.replace('watch?v=', 'embed/');
        let trustedVideo = this.domSanitizer.bypassSecurityTrustResourceUrl(embed);
        videos.push(trustedVideo);
      });

      //Adiciona videos a variavel de escopo global
      this.videos = videos;
    }

    console.log(this);

    //Carrega função
    $fn();

  }

  //Para instituições, carrega lista de usuários pertencentes
  getMyMembersTeam() {
    this.user._teamObservable.subscribe((resp: any) => {

      if (Object.keys(resp).length <= 0) {
        return;
      }

      //Atribui dados ao modelo
      this.team = resp;

    });
  }

  deleteMember($user_id: number) {

    let confirmDelete = this.alert.create({
      title: this.deleteMessage.YOU_WILL_EXCLUDE_MEMBER,
      subTitle: this.deleteMessage.YOU_SURE,
      buttons: [{
        text: 'DELETE',
        handler: data => {
          this.api.delete('user/self/club_user/' + $user_id).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
              return;
            }

            //Sucesso 
            if (resp.success != undefined) {
              //Emite um evento para ser capturado pelo componente pai
              this.reloadUserData();
            }

          }, err => {
            return;
          });
        }
      }, {
        text: 'CANCEL',
      }]
    });

    confirmDelete.present();

  }

  //Abrir modal passando ID do usuário para alteração
  editMember($user_id: number) {
    this.editData('teamData', $user_id);
  }

  //Abrindo modal com dados de item a editar
  calendarUpdate($event) {
    this.editData($event.form, $event.event, function () {
      //Recarrega lista de calendários
      $event.component.reload();
    });
  }

  //Abrir modal com dados para atualizar perfil
  editData($component: string, $data: any = undefined, $fn = () => { this.reloadUserData() }) {

    //Criar modal do respectivo component
    let modal = this.modalCtrl.create(this.ListComponents[$component], { data: $data });
    modal.onDidDismiss((data) => {

      //Se modal foi fechado sem enviar dados  
      if (data == null || data == undefined) {
        return;
      }

      //Verificar há mais de um dado no array 
      if (Object.keys(data).length <= 0) {
        return;
      }

      //Se houve erro
      if (data.error != undefined) {
        return;
      }

      //Retorna mensagem proveninete do servidor
      let responseText = data.success[Object.keys(data.success)[0]];

      //Mostrar resposta
      let toast = this.toastCtrl.create({
        message: responseText,
        duration: 3000,
        position: "bottom"
      });

      toast.present();

      //Executar função
      $fn();

    });

    //Inicializar modal
    modal.present();

  }

}
