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
    
    //Define user de notificão
    if (this.notifyID != undefined) {
      this.$url = '/user/' + this.notifyID;
    }

    //Adciona parametro de paginação
    if(this.$paged > 0){
      this.$url = '/paged/' + this.$paged;
    }

    this.query();

    //Adicionar popup ao elemento para sobrepor header
    this.pageElement = document.getElementsByTagName('page-dashboard'); 
    let $index = this.pageElement.length - 1;
    this.pageElement[$index].appendChild(this.pageElement[$index].querySelector('.popover-notify')); 
    this.notifyElement = document.getElementsByClassName('popover-notify');

  }

  query(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.api.get(Notify.$getNotify + this.$url).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(Object.keys(resp).length < 0){
        return;
      }

      //Se não houver notificações
      if(resp.error != undefined) {
        return;
      }
        
      //Retorna array de timelines
      for (const element of resp.notifyList) {
        if(element == '' || element == undefined) continue;
          this.currentNotifyItems.push(element);
      }      

      //Atribui numero de notificações não lidas
      this.notifyCount = resp.total;

    }, err => { 
        return; 
    });

  }

  //Recarrega os itens de notificação
  reloadNotify($event, $i:number, notifyData:any){
      
      //Exclui item do array
      this.currentNotifyItems.splice($i, 1);
      
      //Diminui um item na contagem
      if (notifyData.read == 1){
          this.notifyCount = (this.notifyCount > 0)? this.notifyCount - 1 : null;
      }
      
  }

  //Marca todas notificações como lida
  allNotifyAsRead() {

    if(this.notifyCount > 0) {
      
      //Diminui um item na contagem
      this.notifyCount = undefined; 

      //Retorna contagem de notificação
      this.api.put(Notify.$getNotify + this.$url, []).subscribe((resp) => {});  
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

    //Marca todas as notificações como lidas
    this.allNotifyAsRead();
    
    //Ao clicar fora da área de notificação >> fechar    
    page.addEventListener('click', function(ev){
      ev.preventDefault(); 
      popup.classList.remove('open'); 
    });

  }

  loadMore($event){} 

}
