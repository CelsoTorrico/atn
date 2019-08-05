import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Cookie } from '../../providers';
import { BrazilStates } from '../../providers/useful/states';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ng2-cookies';
import { DashboardPage } from '../dashboard/dashboard';
import { GenderList } from '../../providers/gender/gender';
import { profileTypeList } from '../../providers/profiletypes/profiletypes';
import { SportList } from '../../providers/sport/sport';
import { ClubList } from '../../providers/clubs/clubs';


@IonicPage({
  segment: 'search',
})
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
  protected $typeUserList:any[];
  //Lista de Genêros  
  protected $genderList:any;

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
      states:BrazilStates,
      gender: GenderList,
      profileType: profileTypeList,
      sportList: SportList,
      clubList: ClubList,
      public translateService: TranslateService) { 
    
      //Carrega lista de estados do provider
      this.$statesList = states.statesList;  
      this.$statesList.unshift('Qualquer Estado');

      //Lista de tipos de usuário
      this.$typeUserList = profileType.list;
      this.$typeUserList.unshift('Qualquer Usuário');
      
      //Lista de genêros
      this.$genderList =  gender.list;
      this.$genderList.unshift('Qualquer Genêro');

      //Lista de Esportes
      sportList.load().then((resp) => {
        this.$sportTable  = sportList.table;
        this.$sportList   = sportList.list;
      });      

      //Lista de Clubes
      clubList.load().then((resp) => {
        this.$clubsList  = clubList.table;
      });

      //Retorna dados vindos do widget de busca
      this.query.display_name = this.navParams.get('display_name');

      //Se widget tiver dados enviados
      if(this.query.display_name != ''){
        this.widgetSearch(); 
      }  
      
  }

  ngOnInit() { 
  
  }

  showFilterOptions(){
    if (this.filter) {  
      this.filter = false;
    } else {
      this.filter = true;
    }
  }

  private widgetSearch($fn:any = function(){}) {
      
      //Retorna a lista de clubes para seletor
      this.api.post('/user/search' + this.$url + '/paged/' + this.$paged, this.query).subscribe((resp:any) => {

        //Se reposta não existir
        if(resp.error != undefined || resp == null) {
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
        this.navCtrl.setRoot('Dashboard'); 
    }        
  }


}
