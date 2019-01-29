import { ToastController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
  selector: 'learn-container',
  templateUrl: 'learn.html'
})
export class Learn{

  public learnItems:any[]; 

  public static getLearnUrl = 'learn/';

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private params: NavParams ) {
               
    } 

  //Retorna
  ngOnInit() {
    this.query();     
  }

  query(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(Learn.getLearnUrl).subscribe((resp:any) => {

        //Verifica se existe dados
        if(resp.lenght <= 0){
          return;
        }
       
        //Adiciona os dados do item a variavel
        this.learnItems = resp;    
        

    }, err => { 
        return;  
    });

  }

}
