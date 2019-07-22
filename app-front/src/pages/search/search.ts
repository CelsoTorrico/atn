import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Cookie } from '../../providers';
import { BrazilStates } from '../../providers/useful/states';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ng2-cookies';
import { DashboardPage } from '../dashboard/dashboard';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public query:any = { 
    display_name: <string>'',
    sport:  <any>[],
    clubs:  <string>'',
    type:   <string>'',
    city:   <string>'',
    state:  <string>'',
    neighbornhood: <string>'', 
    gender:   <string>'',
    formacao: <string>''
  };

  public filter:boolean = false;

  //Campos selecionados
  public $typeUserSelected:string;
  public $sportSelected:any = [];

  //Lista de tipos de usuário
  protected $typeUserList = [
      {valor: '', texto: 'Qualquer'},
      {valor: 1,  texto: 'Atleta'}, 
      {valor: 2,  texto: 'Profissional do Esporte'},
      {valor: 3,  texto: 'Faculdade'},
      {valor: 4,  texto: 'Clube Esportivo'},
      {valor: 5,  texto: 'Confederação'} 
  ];

  protected $genderList = [
      {valor: '',       texto: 'Qualquer'},
      {valor: 'male',   texto: 'Masculino'}, 
      {valor: 'female', texto: 'Feminino'}
  ];

  //Lista de Esportes
  protected $sportTable:any;
  protected $sportList = [];

  //Lista de Clubes
  protected $clubsList = [];

  //Lista de membros
  protected $memberList = [];

  //Lista de Estados
  protected $statesList = [];

  //Paginação
  public $url:string = '';
  public $paged:number = 1;  

  constructor(
      public api:Api, 
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public states:BrazilStates,
      public translateService: TranslateService,
      private cookieService: CookieService) { 
    
      //Carrega lista de estados do provider
      this.$statesList = this.states.statesList;  
      this.$statesList.unshift('Qualquer Estado');

      //Retorna dados vindos do widget de busca
      this.query.display_name = this.navParams.get('display_name');

      //Se widget tiver dados enviados
      if(this.query.display_name != ''){
        this.widgetSearch(); 
      }  
  }

  ionViewDidLoad() {        
      //Verifica existência do cookie e redireciona para página
      Cookie.checkCookie(this.cookieService, this.navCtrl); 
  }

  ngOnInit() {
    this.getSportList();
    this.getClubsList();
  }

  showFilterOptions(){
    if (this.filter) {  
      this.filter = false;
    } else {
      this.filter = true;
    }
  }

  getSportList(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.api.get('/user/sports').subscribe((resp:any) => {

        //Tabela de Esportes com ID e nome
        this.$sportTable = resp;

        //Lista de apenas nomes de esportes
        resp.forEach(element => {
            //[0] = id, [1] = sport_name
            this.$sportList.push(element[1]);
        });

    }, err => { 
        return; 
    });
    
  }

  getClubsList(){
    //Retorna a lista de clubes para seletor
    this.api.get('/user/clubs').subscribe((resp:any) => {

        //Tabela de Esportes com ID e nome
        this.$clubsList = resp;

    }, err => { 
        return; 
    });
    
  }

  private widgetSearch($fn:any = function(){}){
      
      //Retorna a lista de clubes para seletor
      this.api.post('/user/search' + this.$url + '/paged/' + this.$paged, this.query).subscribe((resp:any) => {

        //Se reposta não existir
        if(resp.error != undefined || resp == null){
          $fn(); return;
        }

        //Lista de Usuários
        for (const element of resp) {
          if(element.error != undefined || element == null){
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

  submitSearch(form:NgForm, event){
    
    event.preventDefault();

    //Reseta o contador de páginas
    this.$paged = 1;

    //Reseta lista de usuários já pesquisados
    this.$memberList = [];

    //Adiciona tipo de usuário selecionado
    this.query.type  = this.$typeUserSelected;
    
    //Define ID's dos esportes selecionados
    this.$sportSelected.forEach(element => {
        this.setChooseSports(element); 
    });

    //Retorna a lista de clubes para seletor
    this.widgetSearch();

  }

  private setChooseSports($sportChoose:string) {
    //Intera sobre items
    this.$sportTable.forEach(element => {
        //Compara valores selecionados com tabela de esportes
        if (element[1] == $sportChoose) {
            //Atribui valor a array
            this.query.sport.push(element[0]);
        }
    });

  }

  loadMore($event) {

    setTimeout(() => {
      
      //Adiciona uma página a mais para adicionar itens
      this.$paged = this.$paged + 1;

      //Função para finalizar
      let endFn = function(){
        $event.complete();
      };

      this.widgetSearch(endFn);

    }, 1000);

  }

  //Abre uma nova página
  backButton() {
    if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
    } else {
        this.navCtrl.setRoot(DashboardPage);
    }        
  }


}
