import { DomSanitizer } from '@angular/platform-browser';
import { BrazilStates } from './../../../providers/useful/states';
import { ProfileComponent } from './profile.component';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { NavController, ToastController, AlertController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { Api } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';
import { ReportPage } from '../../report/report';

@Component({
  selector: 'club',
  templateUrl: 'club.html'
})
export class ClubComponent extends ProfileComponent {

  //Variveis de template de usuario
  calendarObservable: Observable<ArrayBuffer> = this.api.get('/calendar');

  isLogged: boolean = false;

  ID: number = null;

  type: number = null;

  display_name: string = '';

  sport: any = [{
    ID: '',
    sport_name: ''
  }]

  /** Variaveis para a busca  */
  public query: any = {
    display_name: <string>'',
    sport: <any>[],
    clubs: <string>'',
    type: <string>'',
    city: <string>'',
    state: <string>'',
    neighbornhood: <string>'',
    gender: <string>'',
    formacao: <string>''
  };

  public filter: boolean = false;

  //Campos selecionados
  public $typeUserSelected: string;
  public $sportSelected: any = [];

  //Lista de tipos de usuário
  protected $typeUserList = [
    { valor: '', texto: 'Qualquer' },
    { valor: 1, texto: 'Atleta' },
    { valor: 2, texto: 'Profissional do Esporte' },
    { valor: 3, texto: 'Faculdade' },
    { valor: 4, texto: 'Clube Esportivo' },
    { valor: 5, texto: 'Confederação' }
  ];

  protected $genderList = [
    { valor: '', texto: 'Qualquer' },
    { valor: 'male', texto: 'Masculino' },
    { valor: 'female', texto: 'Feminino' }
  ];

  //Lista de Esportes
  protected $sportTable: any;
  protected $sportList = [];

  //Lista de Estados
  //Carrega lista de estados do provider
  states: BrazilStates = new BrazilStates();
  protected $statesList = this.states.statesList;

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
    private loadingCtrl: LoadingController) {

    super(navCtrl, api, toastCtrl, alert, modalCtrl, domSanitizer, translateService);

    //Carrega tradução de loading
    this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
      this.loading_placeholder = data.LOADING;
    });

  }

  //Função que inicializa
  ngOnInit() {

    //Carrega dados do usuário de contexto
    this.loadUserLoadData().then(() => {
      this.getSportList();
    });

    //Adicionando campo para qualquer estado  
    this.$statesList.unshift('Qualquer Estado');

  }

  //Abrindo modal com dados de item a editar
  calendarUpdate($event) {
    this.editData($event.form, $event.event, function () {
      //Recarrega lista de calendários
      $event.component.reload();
    });
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
   *  Retorna a lista de esportes do banco e atribui ao seletor
  *   Lista de apenas nomes de esportes 
  * */
  private getSportList() {

    //Tabela de Esportes com ID e nome
    this.$sportTable = this.sport;

    for (const element of this.sport) {
      //[0] = id, [1] = sport_name
      this.$sportList.push({ display: element.sport_name, value: element.ID });
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

        $fn();

        return;
      }

      //Adiciona usuários ao array
      this.team = resp;

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
      this.setChooseSports(element.display);
    });

    //Retorna a lista de clubes para seletor
    this.widgetSearch();

  }

  private setChooseSports($sportChoose: string) {
    //Intera sobre items
    this.$sportTable.forEach(element => {
      //Compara valores selecionados com tabela de esportes
      if (element.sport_name == $sportChoose) {
        //Atribui valor a array
        this.query.sport.push(element.ID);
      }
    });

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
        console.log(resp);
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
    let $browser = this.api.appBrowser.create(filePath, '_blank');
    $browser.show();

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


}
