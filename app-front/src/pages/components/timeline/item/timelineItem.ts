import { NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../../providers';
import { TranslateService } from '@ngx-translate/core';
import { getUrlScheme } from '@angular/compiler';

@Component({
  selector: 'timelineItem',
  templateUrl: 'timelineItem.html'
})
export class TimelineItem {

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

  public $postID:number;

  private getUrl = 'timeline/'; //url para query

  constructor(
    public api: Api,
    public navCtrl: NavController,
    public params: NavParams,
    public viewer: ViewController, 
    public translateService: TranslateService) { 
    
      this.translateService.setDefaultLang('pt-br');
        
        //Adicionando enviadors da view anterior
        this.$postID = this.params.get('post_id');        
    } 

  //Inicialização
  ngOnInit() {
    this.query();     
  }

  /** Realiza requisição de dados com parametros da classe */
  query($fn:any = function(){}) {
    //Retorna a lista de esportes do banco e atribui ao seletor
    let items = this.api.get(this.getUrl + this.$postID).subscribe((resp:any) => {

        //Verifica se existe dados
        if(Object.keys(resp).length <= 0){
          return;
        }
       
        //Adiciona os dados do item a variavel
        this.TimelineItem = resp;    
        
        //Adiciona lista de comentários
        this.currentCommentItems = this.TimelineItem.list_comments; 

        $fn(this);

    }, err => { 
        return;  
    });

  }

  //Altera a url para requisição GET
  _setUrl($newUrl:string = this.getUrl){
    this.getUrl = $newUrl;
  }

  //Altera Id do elemento a retornar na requisição
  _setPostID($newId:number = this.$postID) {
    this.$postID = $newId;
  }

  //Recarrega os comentário após atuallização
  reloadCommentsAfterUpdate($event){
    this.query();
  }

  dismiss(){
    this.viewer.dismiss();
  }

}
