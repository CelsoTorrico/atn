import { ToastController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
  selector: 'learn-container',
  templateUrl: 'learn.html'
})
export class Learn {

  public static getLearnUrl = 'learn';
  public $url:string = '';
  public $paged:number = 0;

  public learnItems: any[];

  constructor(
    public api: Api,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private params: NavParams) {

  }

  //Retorna
  ngOnInit() {

    //Adciona parametro de paginação
    if(this.$paged > 0){
      this.$url = '/paged/' + this.$paged;
    }

    this.query();
  }

  query($fn:any = function(){}) {
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(Learn.getLearnUrl + this.$url).subscribe((resp: any) => {

      //Verifica se existe dados
      if (Object.keys(resp).length <= 0) {
        return;
      }

      //Se voltar erro
      if(resp.error != undefined){
          $fn();
          return;
      }

      //Adiciona os dados do item a variavel
      this.learnItems = resp;

      $fn();

    }, err => {
      return;
    });

  }


  //Carrega mais items de learn via infinescroll
  loadMore($event) {

    setTimeout(() => {

      //Adiciona uma página a mais para adicionar itens
      this.$paged = this.$paged + 1;
      this.$url = '/paged/' + this.$paged;

      //Função para finalizar
      let endFn = function () {
        $event.complete();
      };

      this.query(endFn);

    }, 500);

  }

}
