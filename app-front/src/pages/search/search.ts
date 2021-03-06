import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Api, User } from '../../providers';
import { BrazilStates } from '../../providers/useful/states';
import { TranslateService } from '@ngx-translate/core';
import { GenderList } from '../../providers/gender/gender';
import { profileTypeList } from '../../providers/profiletypes/profiletypes';
import { SportList } from '../../providers/sport/sport';
import { ClubList } from '../../providers/clubs/clubs';
import { TranslateChar } from '../../providers/useful/translateChar';


@IonicPage({
  segment: 'search'
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public query: any = {
    display_name: <string>'', 
    sport: <any>[],
    clubs: <string>'',
    type:  <string>'',
    city:  <string>'',
    state: <string>'',
    neighbornhood: <string>'',
    gender:   <string>'',
    formacao: <string>'',
    birthdate: <any>[],
    user_registered: <any>[],
    photo: <boolean>false,
    video: <boolean>false,
    accept_assessments: <boolean>false
  };

  public filter: boolean = false;

  //Campos selecionados
  public $typeUserSelected: string;
  public $sportSelected: any = [];

  //Lista de tipos de usuário
  protected $typeUserList: any[];
  //Lista de Genêros  
  protected $genderList: any;

  //Lista de Esportes
  protected $sportTable: any;
  protected $sportList = [];

  //Lista de Clubes
  protected $clubsList = [];

  //Lista de membros
  protected $memberList = [];

  //Lista de Estados
  protected $statesList = [];

  //Paginação
  public $url: string = '';
  public $paged: number = 1;

  //tradução
  loading_placeholder: string

  constructor(
    private user: User,
    public api: Api,
    public navCtrl: NavController,
    public navParams: NavParams,
    states: BrazilStates,
    gender: GenderList,
    profileType: profileTypeList,
    sportList: SportList,
    clubList: ClubList,
    private loadingCtrl: LoadingController,
    translateService: TranslateService) {

    //Tradução
    translateService.get(["LOADING"]).subscribe((resp: any) => {
      this.loading_placeholder = resp.LOADING;
    });

    //Carrega lista de estados do provider
    this.$statesList = states.statesList;
    if( this.$statesList.indexOf('Qualquer Estado') <= -1) {
      this.$statesList.unshift({valor: '', texto: 'Qualquer Estado' });
    }

    //Lista de tipos de usuário
    this.$typeUserList = profileType.list;
    if( this.$typeUserList.indexOf('Qualquer Usuário') <= -1) {
      this.$typeUserList.unshift('Qualquer Usuário');
    }

    //Lista de genêros
    this.$genderList = gender.list;
    if( this.$genderList.indexOf('Qualquer Genêro') <= -1) {
      this.$genderList.unshift('Qualquer Genêro');
    }

    //Lista de Esportes
    sportList.load().then((resp) => {
      this.$sportTable = sportList.table;
      this.$sportList = sportList.list;
    });

    //Lista de Clubes
    clubList.load().then((resp) => {
      this.$clubsList = clubList.table;
    });

    //Retorna dados vindos do widget de busca
    this.query.display_name = this.navParams.get('display_name');

    //Se widget tiver dados enviados
    if (this.query.display_name != '') {
      this.widgetSearch();
    }

  }

  ionViewDidLoad() {
    /** Verifica se usuário já esta logado anteriormente na plataforma */
    this.user.isLoggedUser().then((resp) => {
      //Redireciona para a página de Login
      if (!resp) {
        this.navCtrl.setRoot('Login');
      }
    });
  }

  ngOnInit() {

  }

  showFilterOptions() {
    if (this.filter) {
      this.filter = false;
    } else {
      this.filter = true;
    }
  }

  private widgetSearch($fn: any = function () { }) {

    //Criando objeto loading
    let loading = this.createLoading();
    loading.present();

    //Retorna a lista de clubes para seletor
    this.api.post('/user/search' + this.$url + '/paged/' + this.$paged, this.query).subscribe((resp: any) => {

      loading.dismiss(); //Fechar loading

      //Se reposta não existir
      if (resp.error != undefined || resp == null) {
        $fn(); return;
      }

      //Lista de Usuários
      for (const element of resp) {
        if (element.error != undefined || element == null) {
          continue;
        }
        this.$memberList.push(element);
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
    this.$memberList = [];

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

  /** Carrega mais usuários  */
  loadMore($event) {

    setTimeout(() => {

      //Adiciona uma página a mais para adicionar itens
      this.$paged = this.$paged + 1;

      //Função para finalizar
      let endFn = function () {
        $event.complete();
      };

      this.widgetSearch(endFn);

    }, 1000);

  }

  //Abre uma nova página
  backButton() {
    if (this.navCtrl.canSwipeBack()) {
      this.navCtrl.getPrevious();
    } else {
      this.navCtrl.setRoot('Dashboard');
    }
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

  //Verifica se variavel é ojecto e retorna boolean 
  isObject($var:any) {
    return (typeof $var == 'object')? true : false;
  }


}
