import { ToastController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../../providers';

@Component({
  selector: 'timelineItem',
  templateUrl: 'timelineItem.html'
})
export class TimelineItem {

  public $postID:number;
  
  public TimelineItem:any = {
    ID: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: {

      }
    },
    post_date: '',
    post_content: '',
    attachment: '',
    quantity_comments: ''

  }; 

  public currentCommentItems:any[];

  public static getTimelineUrl = 'timeline/';

  constructor(
    public api: Api,
    public navCtrl: NavController,
    private params: NavParams,
    private viewer: ViewController ) {
        //Adicionando enviadors da view anterior
        this.$postID = this.params.get('post_id');        
    } 

  //Retorna
  ngOnInit() {
    this.query();     
  }

  query(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(TimelineItem.getTimelineUrl + this.$postID).subscribe((resp:any) => {

        //Verifica se existe dados
        if(resp.lenght <= 0){
          return;
        }
       
        //Adiciona os dados do item a variavel
        this.TimelineItem = resp;    
        
        //Adiciona lista de comentários
        this.currentCommentItems = this.TimelineItem.list_comments; 

    }, err => { 
        return;  
    });

  }

  dismiss(){
    this.viewer.dismiss();
  }

}
