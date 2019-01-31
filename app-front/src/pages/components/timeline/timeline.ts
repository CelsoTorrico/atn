import { TimelineItem } from './item/timelineItem';
import { ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline {
  
  //Parametros de URL
  @Input() public timelineID:number;
  public static $getTimelineUrl:string = 'timeline';
  public $url:string = '';
  public $paged:number = 0;
  
  //Lista de Items
  public currentItems:any[] = [];

  public addTimeline:any = {
    post_content: <string> '',
    post_visibility: <number> 0,
    post_image: <any> null, 
  }

  public visibility:string[];

  public commentText:any = { comment_content : <string> ''}; 

  public commentShow:any;

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    private toastCtrl: ToastController ) {} 

  //Retorna
  ngOnInit() {
    
    //Define timeline de usuario a mostrar
    if (this.timelineID != undefined) {
      this.$url = '/user/' + this.timelineID;
    }

    //Adciona parametro de paginação
    if(this.$paged > 0){
      this.$url = '/paged/' + this.$paged;
    }

    this.query();
    this.getVisibility();
  }

  query(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(Timeline.$getTimelineUrl + this.$url).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length > 0){
        
        //Intera sobre elementos
        resp.forEach(element => {
          //Retorna array de timelines
          this.currentItems.push(element);
        }); 

      }         

    }, err => { 
        return; 
    });

  }

  getVisibility(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get('timeline/visibility').subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length > 0){
        
        this.visibility = resp;

      }         

    }, err => { 
        return; 
    });

  } 

  /**
   * Adicionar um novo item de timeline
   */
  addItem(form:NgForm) {
      this.api.post('/timeline', this.addTimeline).subscribe((resp:any) => {
        
        if(resp.success != undefined){
          
          let toast = this.toastCtrl.create({
            message: resp.success.timeline,
            duration: 4000,
            position:'bottom'
          });

          toast.present();

        }

      });
  }

  //Carregar comentários
  getItem($postID:number, event) {
    event.preventDefault();

    //Impede de executar ações em cascata em botões com evento
    if(event.target.tagName == 'IMG' || event.target.classList.contains('button-inner')) {
      return;
    }

    //Invoca um modal passando ID da Timeline
    let modal = this.modalCtrl.create(TimelineItem, { post_id: $postID });
    modal.present(); 

  }

}
