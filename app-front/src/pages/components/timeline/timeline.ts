import { TimelineItem } from './item/timelineItem';
import { Component, Input, ViewChild } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';
import { TimelineSingle } from './item/timeline-single.component';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline {
  
  //Parametros de URL
  @ViewChild(TimelineSingle) timelineSingle: TimelineSingle;
  @Input() public timelineID:number;
 
  private $getTimelineUrl:string = 'timeline';
  public $url:string = '';
  public $paged:number = 1;
  
  //Lista de Items
  public currentItems:any[] = [];

  public commentText:any = { comment_content : <string> ''}; 

  public commentShow:any;

  //Dados de usuário a injectar em componente filho
  public currentUser:any;

  private $lastItemDatetime:string;

  constructor(
    public api: Api,
    public user:User,
    public modalCtrl: ModalController,
    public translateService: TranslateService) {     
      this.translateService.setDefaultLang('pt-br');
    } 

  //Retorna
  ngOnInit() {
    
    //Define timeline de usuario a mostrar
    if (this.timelineID != undefined) {
      this.$url = '/user/' + this.timelineID;
    }
    else{
      //Define caminho para timeline user logado
      this.$url = '';
    }    

    this.query();

  }

  ngAfterViewChecked() { 
    if(this.user._user != undefined) {
      this.currentUser = this.user._user; 
    }

    this.user.dataReady.subscribe(() => {
      this.currentUser = this.user._user; 
    });    
  }

  query($fn:any = function(){}) {
    
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(this.$getTimelineUrl + this.$url + '/paged/' + this.$paged).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(Object.keys(resp).length <= 0){
        return;
      }

      //Se houve erro
      if(resp.error){
        $fn(); //função personalizada
        return;
      }

      //Atribui datetime de item mais novo requisitado pela query
      //Será usado na atualização automática
      this.$lastItemDatetime = resp[0].post_date;
        
      //Intera sobre elementos
      for (const element of resp) {
        //Retorna array de timelines
        this.currentItems.push(element);
      }       
      
      $fn();  //função personalizada

    }, err => { 
        return; 
    });

  }

  //Após excluido item de timeline, eliminar do loop de items
  hideTimeline($event, $index) {
    //Atualiza post com dados atualizados
    this.currentItems.splice($index, 1);
  }

  //Após a inserção de um comentário
  updateTimelineComment($event, $index) {
    
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.api.get(this.$getTimelineUrl + '/' + $event).subscribe((resp:any) => {

        //Verifica se existe dados
        if(resp.lenght <= 0){
          return;
        }

        //Atualiza post com dados atualizados
        this.currentItems[$index] = resp;

    }, err => { 
        return;  
    });

  }

  //Recarrega items e zera
  reload() {
    this.$paged = 1;
    this.currentItems = [];
    this.query();
  }

  //Retorna a lista de ultimas timelines baseadas no tempo
  loadLasts() {    
    
    this.api.post(this.$getTimelineUrl + '/lasts', {
      current_time : this.$lastItemDatetime
    }).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(Object.keys(resp).length <= 0){
        return;
      }

      //Retorna se houve erro na requisição
      if(resp.error){
        return;
      }

      //Atribui datetime de item mais novo requisitado pela query
      //Será usado na atualização automática
      this.$lastItemDatetime = resp[0].post_date;
        
      //Intera sobre elementos
      for (const element of resp.reverse()) {
        //Retorna array de timelines
        this.currentItems.unshift(element);
      }

    }, err => { 
        return; 
    });
  }

  //Carrega mais items de timeline via infinescroll
  loadMore($event) {

    setTimeout(() => {
      
      //Adiciona uma página a mais para adicionar itens
      this.$paged = this.$paged + 1;

      //Função para finalizar
      let endFn = function(){
        $event.complete();
      };

      this.query(endFn);

    }, 800);

  }
  
  //Carregar comentários
  getItem($postID:number, event) {
    
    event.preventDefault();

    //Impede de executar ações em cascata em botões com evento
    if(event.target.tagName == 'IMG' || event.target.classList.contains('count-responses') 
    || event.target.classList.contains('badge')) {
      //Invoca um modal passando ID da Timeline
      let modal = this.modalCtrl.create(TimelineItem, { post_id: $postID });
      modal.present(); 
    }

  }

  public _setUrl($baseUrl:string = 'timeline'){
    this.$getTimelineUrl = $baseUrl;
  }

}
