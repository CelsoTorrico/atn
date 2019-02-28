import { TimelineItem } from './item/timelineItem';
import { ToastController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Api } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline {
  
  //Parametros de URL
  @Input() public timelineID:number;
 
  public static $getTimelineUrl:string = 'timeline';
  public $url:string = '';
  public $paged:number = 1;
  
  //Lista de Items
  public currentItems:any[] = [];

  public commentText:any = { comment_content : <string> ''}; 

  public commentShow:any;

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    private toastCtrl: ToastController, 
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

  query($fn:any = function(){}){
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(Timeline.$getTimelineUrl + this.$url + '/paged/' + this.$paged).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(Object.keys(resp).length <= 0){
        return;
      }

      if(resp.error){
        $fn();
        return;
      }
        
      //Intera sobre elementos
      resp.forEach(element => {
        //Retorna array de timelines
        this.currentItems.push(element);
      });         
      
      $fn();

    }, err => { 
        return; 
    });

  }

  //Após excluido item de timeline, eliminar do loop de items
  hideTimeline($event, $index){
    //Atualiza post com dados atualizados
    this.currentItems.splice($index, 1);
  }

  //Após a inserção de um comentário
  updateTimelineComment($event, $index){
    
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.api.get(Timeline.$getTimelineUrl + '/' + $event).subscribe((resp:any) => {

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
    if(event.target.tagName == 'IMG' || event.target.classList.contains('count-responses')) {
      //Invoca um modal passando ID da Timeline
      let modal = this.modalCtrl.create(TimelineItem, { post_id: $postID });
      modal.present(); 
    }

  }

}
