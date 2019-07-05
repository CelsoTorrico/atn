import { DomSanitizer } from '@angular/platform-browser';
import { BrazilStates } from './../../../providers/useful/states';
import { ProfileComponent } from './profile.component';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { NavController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Api } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Component({
  selector: 'club',
  templateUrl: 'club.html'
})
export class ClubComponent extends ProfileComponent {

  //Variveis de template de usuario
  calendarObservable: Observable<ArrayBuffer> = this.api.get('/calendar');

  private fileTransfer: FileTransferObject

  listCalendar: any = []

  isLogged: boolean = false;

  ID: number = null;

  type: number = null;

  display_name: string = '';

  sport: any = [{
    ID: '',
    sport_name: ''
  }]

  /** Variaveis para a busca  */

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

  //Lista de Estados
  //Carrega lista de estados do provider
  states:BrazilStates = new BrazilStates();
  protected $statesList = this.states.statesList;

  //Paginação
  public $url:string = '';
  public $paged:number = 1; 


  constructor(
    public navCtrl: NavController,
    public api: Api,
    public toastCtrl: ToastController,
    public alert:AlertController,
    public modalCtrl: ModalController,
    public domSanitizer: DomSanitizer,
    public translateService: TranslateService){
        
      super(navCtrl, api, toastCtrl, alert, modalCtrl, domSanitizer, translateService);

  }

  //Função que inicializa
  ngOnInit() {
    
    //Carrega dados do usuário de contexto
    this.getUserLoadData();

    //Adicionando campo para qualquer estado  
    this.$statesList.unshift('Qualquer Estado');

    //Carrega eventos do clube
    this.getCalendar();
  }

  private getUserLoadData() { 
    this.profile.subscribe((resp:any) => {

      //Adicionando valores as variavel global
      let atributes = resp;

      if (atributes.metadata != undefined) {
        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in atributes.metadata) {
          if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
            this[key] = atributes.metadata[key];
          }
        }
      }

      //Atribuindo dados aos modelos
      this.ID = atributes.ID;

      if (atributes.type != null) this.type = atributes.type.ID; 
      if (atributes.sport != null) this.sport = atributes.sport;

      //Apenas para instituições
      if(this.type > 3){

        //Atribui data
        this.current_users = atributes.current_users;
        this.max_users = atributes.max_users;

        //executa busca de membros da instituição
        this.getMyMembersTeam();  
        
        //Retorna lista de esportes permitidos na busca
        this.getSportList();
        
      }

    })
  }

  //Faz requisição a APi para atribuir lista de calendários
  getCalendar() {
    
    this.calendarObservable.subscribe((resp: any) => {

      if (Object.keys(resp).length <= 0) {
        return;
      }

      //Atribui dados ao modelo
      this.listCalendar = resp;

    });
  }

  //Após excluido item de timeline, eliminar do loop de items
  hideCalendar($event, $index){
    //Atualiza post com dados atualizados
    this.listCalendar.splice($index, 1);
  }

  /** Função da Busca de Equipe */
  showFilterOptions(){
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

    this.sport.forEach(element => {
        //[0] = id, [1] = sport_name
        this.$sportList.push({display: element.sport_name, value: element.ID });
    });
    
  }

  private widgetSearch($fn:any = function(){}){
      
      //Retorna a lista de clubes para seletor
      this.api.post('/user/self/club_user/search' + this.$url + '/paged/' + this.$paged, this.query).subscribe((resp:any) => {

        //Se reposta não existir
        if(resp.error != undefined || resp == null){
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

  submitSearch(form:NgForm, event){
    
    event.preventDefault();

    //Reseta o contador de páginas
    this.$paged = 1;

    //Reseta lista de usuários já pesquisados
    this.team = [];

    //Adiciona tipo de usuário selecionado
    this.query.type  = this.$typeUserSelected;
    
    //Define ID's dos esportes selecionados
    this.$sportSelected.forEach(element => {
        this.setChooseSports(element.display); 
    });

    //Retorna a lista de clubes para seletor
    this.widgetSearch();

  }

  private setChooseSports($sportChoose:string) {
    //Intera sobre items
    this.$sportTable.forEach(element => {
        //Compara valores selecionados com tabela de esportes
        if (element.sport_name == $sportChoose) {
            //Atribui valor a array
            this.query.sport.push(element.ID);
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

  viewReport() {
      
      let $reportFilter:any = {
        user_ids : [],
        filter: []
      };

      this.team.forEach(element => {
        $reportFilter.user_ids.push(element.ID);
      });

      $reportFilter.filter = this.query;

    //Retorna a lista de clubes para seletor
    this.api.post('report', $reportFilter).subscribe((resp:any) => {

      //Se reposta não existir
      if (resp.error != undefined || resp == null) {
        console.log(resp); 
      }

    }, err => { 
        return; 
    });
  }

  exportReport($isPdf:boolean = false) {

      let $reportFilter:any = {
        user_ids : [],
        filter: []
      };

      let $extension:string = ($isPdf)? 'pdf' : 'xlsx';

      this.team.forEach(element => {
         $reportFilter.user_ids.push(element.ID);
      });

      $reportFilter.filter = this.query;

     //Retorna a lista de clubes para seletor
     this.api.post('report/report.'+ $extension, $reportFilter).subscribe((resp: any) => {

      //Se reposta não existir
      if (resp.error != undefined || resp == null) {
          return;
      }
      
      //Executa donwload
      this.download('report.'+ $extension, resp);

    }, err => { 
        return; 
    });

  }

  download(fileName , filePath) {

        // Método de Download Temporário
        let $browser = this.api.appBrowser.create(filePath, '_blank');
        $browser.show();

        return;
        
        /*let url = encodeURI(filePath);

        this.fileTransfer = (FileTransfer).create();

        let fileBinary = File.readAsBinaryString(filePath, fileName);
        console.log(fileBinary);

        this.fileTransfer.download(url, File.externalRootDirectory + fileName, true).then((entry) => {
          console.log('download');
        }, (error) => {
          console.log('error download');
        });*/
  }


}
