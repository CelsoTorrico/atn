import { Component, Input } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
  selector: 'notify',
  templateUrl: 'notify.html'
})
export class Notify {

  //Contagem de notificações
  public notifyCount:number;
  
  //Parametros de URL
  @Input() public notifyID:number;

  public static $getNotify:string = 'notify';
  public $url:string = '';
  public $paged:number = 0;
  
  //Lista de Items
  @Input() public currentNotifyItems:any[] = [];

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    public modalCtrl: ModalController ) {} 

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
    
  }

  query(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(Notify.$getNotify + this.$url).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length > 0){
        
        //Intera sobre elementos
        resp.forEach(element => {
          //Retorna array de timelines
          this.currentNotifyItems.push(element);
          this.notifyCount = this.currentNotifyItems.length;
        }); 

      }         

    }, err => { 
        return; 
    });

  }

  //Abrir popup notificação
  openNotifications($event){
    
    $event.preventDefault();

    //Adiciona ao elemento pai
    let page = document.getElementsByTagName('page-dashboard');
    let find = page[0].querySelector('.popover-notify');
    let popup:any = find;

    //Define a posicao do elemento popup
    popup.style.left = ($event.pageX - popup.style.width) + 'px'; 
    //popup.style.top  = ($event.pageY + 15) + 'px';
    
    //Adicionar popup ao elemento para sobrepor header
    page[0].appendChild(popup);

    setTimeout(function(){
      popup.classList.add('open');
    }, 300)

    //Ao clicar fora da área de notificação >> fechar
    popup.addEventListener('mouseout', function(){
        page[0].addEventListener('click', function(ev){
          if(ev.target != popup.children){
            popup.classList.remove('open');
          }
        });
    });

  }

  loadMore($event){} 

}
