import { Component, Input } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'notify',
  templateUrl: 'notify.html'
})
export class Notify {

  //Contagem de notificações
  @Input() public notifyCount:number;
  
  //Parametros de URL
  @Input() public notifyID:number;

  public static $getNotify:string = 'notify'; 
  public $url:string = '';
  public $paged:number = 0;
  
  //Lista de Items
  @Input() public currentNotifyItems:any[] = [];

  public pageElement:any;
  public notifyElement:any;

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public translateService: TranslateService) { 
    
      this.translateService.setDefaultLang('pt-br');
    } 

  //Retorna
  ngOnInit() {
    
    //Define timeline de usuario a mostrar
    if (this.notifyID != undefined) {
      this.$url = '/user/' + this.notifyID;
    }

    //Adciona parametro de paginação
    if(this.$paged > 0){
      this.$url = '/paged/' + this.$paged;
    }

    this.query();

    //Adicionar popup ao elemento para sobrepor header
    this.pageElement = document.getElementsByTagName('ion-app');
    this.pageElement[0].appendChild(this.pageElement[0].querySelector('.popover-notify')); 
    this.notifyElement = document.getElementsByClassName('popover-notify');

  }

  query(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.api.get(Notify.$getNotify + this.$url).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(Object.keys(resp).length < 0){
        return;
      }
        
      //Retorna array de timelines
      this.currentNotifyItems = resp;

    }, err => { 
        return; 
    });

  }

  //Recarrega os itens de notificação
  reloadNotify($event, $i){
      //Exclui item do array
      this.currentNotifyItems.splice($i, 1);
      
      //Diminui um item na contagem
      //this.notifyCount = this.notifyCount - 1;
  }

  //Marca todas notificações como lida
  allNotifyAsRead(){

    if(this.notifyCount > 0){
      
      //Diminui um item na contagem
      this.notifyCount = undefined; 

      //Retorna a lista de esportes do banco e atribui ao seletor
      this.api.put(Notify.$getNotify + this.$url, []).subscribe();  
    }

  }

  //Abrir popup notificação
  openNotifications($event){
    
    $event.preventDefault();

    let popup   = this.notifyElement[0]; 
    let page    = document.querySelector('.page-dashboard');     

    //Define a posicao do elemento popup 
    if (window.innerWidth > 768) {
      popup.style.left = ($event.pageX - 275) + 'px'; 
    } else {
      popup.style.left = 'inherit'; 
    } 
    
    //Adicionar classe para visualizar
    popup.classList.toggle('open');

    this.allNotifyAsRead();
    
    //Ao clicar fora da área de notificação >> fechar    
    page.addEventListener('click', function(ev){
      ev.preventDefault(); 
      popup.classList.remove('open'); 
    });

  }

  loadMore($event){} 

}
