import { MemberClub } from './../../components/member/item/member-club';
import { GenderList } from './../../../providers/gender/gender';
import { DomSanitizer } from '@angular/platform-browser';
import { BrazilStates } from './../../../providers/useful/states';
import { ProfileComponent } from './profile.component';
import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { NavController, ToastController, AlertController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';
import { ReportPage } from '../../report/report';
import { profileTypeList } from '../../../providers/profiletypes/profiletypes';
import { SportList } from '../../../providers/sport/sport';
import { TranslateChar } from '../../../providers/useful/translateChar';

@Component({
  selector: 'club',
  templateUrl: 'club.html'
})
export class ClubComponent extends ProfileComponent {

  @ViewChild(MemberClub) memberclub: MemberClub
  @Input() user: User
  @Input() type: number = null

  //Variveis de template de usuario
  calendarObservable: Observable<ArrayBuffer> = this.api.get('/calendar');

  isLogged: boolean = false;

  ID: number = null;

  display_name: string = '';

  max_users:number

  sport: any = [{
    ID: '',
    sport_name: ''
  }]

  /** Variaveis para a busca  */
  public query: any = {
    display_name: <string>'',
    sport: <any>[],
    type: <string>'',
    city: <string>'',
    state: <string>'',
    neighbornhood: <string>'',
    gender: <string>'',
    formacao: <string>''
  };

  //Filtragem
  public filter: boolean = false;

  //Campos selecionados
  public $typeUserSelected: string;
  public $sportSelected: any = [];

  //Lista de tipos de usuário
  protected $typeUserList: any[]

  protected $genderList: any[]

  //Lista de Esportes
  protected $sportTable: any;
  protected $sportList = [];

  //Lista de Estados
  protected $statesList: any[];

  //Paginação
  public $url: string = '';
  public $paged: number = 1;

  //Loading
  loading_placeholder: string

  constructor(
    public navCtrl: NavController,
    public api: Api,
    public toastCtrl: ToastController,
    public alert: AlertController,
    public modalCtrl: ModalController,
    public domSanitizer: DomSanitizer,
    public translateService: TranslateService,
    private loadingCtrl: LoadingController,
    statesList: BrazilStates,
    genderList: GenderList,
    profiletype: profileTypeList,
    sportList: SportList) {

    super(navCtrl, api, toastCtrl, alert, modalCtrl, domSanitizer, translateService);

    //Carrega tradução de loading
    this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
      this.loading_placeholder = data.LOADING;
    });

    //Tabela de Estados
    this.$statesList = statesList.statesList;
    this.$statesList.unshift(''); //Adicionando campo para qualquer estado  

    //Tabela de Generos
    this.$genderList = genderList.list;

    //Tabela de tipos de perfis
    this.$typeUserList = profiletype.list;

    //Retorna lista de esportes
    sportList.load().then((resp) => {
      this.$sportTable = sportList.table
    });

  }

  ngOnInit() {
    if (this.user._user != undefined){
      //Se dados já presentes
      this.currentClubSportsList();
    } else{
      //Se não, subscribe e executa quando pronto
      this.user.dataReady.subscribe(() =>{
        this.currentClubSportsList();
      });
    }
  }

  //Função que inicializa
  ngAfterViewChecked() { 

  }

  private currentClubSportsList() {
    this.user._user.sport.forEach(element => {
      this.$sportList.push(element.sport_name);
    });
  }

  childMemberEvent($event) {
    
    //Função que escuta evento em componente filho
    if ($event == undefined) return;

    if ($event.type == 'edit') {
      this.editMember($event.user_id);
    }

    if ($event.type == 'delete') {
      this.deleteMember($event.user_id);
    }

  }

  /** Função da Busca de Equipe */
  showFilterOptions() {
    if (this.filter) {
      this.filter = false;
    } else {
      this.filter = true;
    }
  }

  /**
   * Faz busca utilizando os parametros
   */
  private widgetSearch($fn: any = function () { }) {

    //Criando objeto loading
    let loading = this.createLoading();
    loading.present();

    //Retorna a lista de clubes para seletor
    this.api.post('/user/self/club_user/search' + this.$url + '/paged/' + this.$paged, this.query).subscribe((resp: any) => {

      //Esconde loading
      loading.dismiss();

      //Se reposta não existir
      if (resp.error != undefined || resp == null) {
        $fn(); return;
      }

      //Adiciona usuários ao array
      //Lista de Usuários
      for (const element of resp) {
        if (element.error != undefined || element == null) {
          continue;
        }
        this.team.push(element);
      }

      //Reseta dados do campo "sport"
      this.query.sport = [];

      $fn();

    }, err => {
      return;
    });
  }

  submitSearch(form: NgForm, event) {

    event.preventDefault();

    //Reseta o contador de páginas
    this.$paged = 1;

    //Reseta lista de usuários já pesquisados
    this.team = [];

    //Adiciona tipo de usuário selecionado
    this.query.type = this.$typeUserSelected;

    //Define ID's dos esportes selecionados
    this.$sportSelected.forEach(element => {
      this.setChooseSports(element);
    });

    //Retorna a lista de clubes para seletor
    this.widgetSearch();

  }

  private setChooseSports($sportChoose) {
    //Intera sobre items
    for (const element of this.$sportTable) {
      //Compara valores selecionados com tabela de esportes
      if (element[1] == $sportChoose.display) {
        //Atribui valor a array
        this.query.sport.push(element[0]);
      }
    }

  }

  //Relatório de forma visual
  viewReport() {

    //Criando objeto loading
    let loading = this.createLoading();
    loading.present();

    let $reportFilter: any = {
      user_ids: [],
      filter: []
    };

    this.team.forEach(element => {
      $reportFilter.user_ids.push(element.ID);
    });

    $reportFilter.filter = this.query;

    //Retorna a lista de clubes para seletor
    this.api.post('report', $reportFilter).subscribe((resp: any) => {

      //Escondendo loading
      loading.dismiss();

      //Se reposta não existir
      if (resp.error != undefined || resp == null) {
        return;
      }

      let nav = this.navCtrl.push(ReportPage, { data: resp, component: this });

    }, err => {
      return;
    });
  }

  //Exportar relatório em forma de excel
  exportReport($isPdf: boolean = false) {

    //Criando objeto loading
    let loading = this.createLoading();
    loading.present();

    let $reportFilter: any = {
      user_ids: [],
      filter: []
    };

    let $extension: string = ($isPdf) ? 'pdf' : 'xlsx';

    this.team.forEach(element => {
      $reportFilter.user_ids.push(element.ID);
    });

    $reportFilter.filter = this.query;

    //Retorna a lista de clubes para seletor
    this.api.post('report/report.' + $extension, $reportFilter).subscribe((resp: any) => {

      //Esconde loading
      loading.dismiss();

      //Se reposta não existir
      if (resp.error != undefined || resp == null) {
        return;
      }

      //Executa donwload
      this.download('report.' + $extension, resp);

    }, err => {
      return;
    });

  }

  //Faz donwload de arquivos
  download(fileName, filePath) {

    // Método de Download Temporário
    window.open(filePath, '_blank');
    return;
  }

  /**
   *  Cria objeto de loading
   */
  private createLoading(): Loading {
    //Define objeto Loading
    return this.loadingCtrl.create({
      content: this.loading_placeholder
    });
  }

  /** 
     * Implementa a seleção de esportes. Inserir valores sem acentuação correta é considerado 
     * @since  2.1
     * */
    tagInputChange(value, target) {

      //Para esportes cadastrados
      if(value == target.display) {
          return true;
      }

      let sport = target.display;
      for (const i in target.display) {

          //Caracteres
          let currentChar = target.display.charAt(i);
          let changed = TranslateChar.change(currentChar);

          //Se não foi encotrado caracter para para substituição
          if (!changed) continue;

          //Substitui ocorrências do caracter na string
          sport = target.display.replace(currentChar, changed);
      }

      //Procura pelo valor na string de esporte
      let regex = new RegExp(value, 'igm');
      let found = sport.match(regex);
  
      if(found) {
          return target.display; 
      }

      return false;
      
  }


}
