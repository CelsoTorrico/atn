import { ToastController, NavParams } from 'ionic-angular';
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
  
  public currentTimelineItem:any = {
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

  public commentText:any = { comment_content : <string> ''};

  public commentShow:any;

  public static getTimelineUrl = 'timeline/';

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private params: NavParams ) {
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
        this.currentTimelineItem = resp;    
        
        //Adiciona lista de comentários
        this.currentCommentItems = this.currentTimelineItem.list_comments; 

    }, err => { 
        return;  
    });

  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    
  }

  //Mostrar campo de comentário
  openComment(event) {
    event.preventDefault();
    this.commentShow = true;
  }

  //Submeter um comentário ao post
  submitComment($postID:number, form:NgForm, event) {
    
    event.preventDefault();

    //Se formulário estiver inválido, mostrar mensagem
    if (form.status == 'INVALID') {
        
        let toast = this.toastCtrl.create({
          message: 'Preencha os campos de email e senha!',
          duration: 4000,
          position:'bottom'
        });

        toast.present();
        
        return;
    }

    //Enviado um comentário a determinada timeline
    let items = this.api.post('timeline/'+ $postID, this.commentText).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length <= 0){
        return;
      }

      //Sucesso 
      if(resp.success != undefined){
        
        let toast = this.toastCtrl.create({
          message: resp.success.comment,
          duration: 4000,
          position:'bottom'
        });

        toast.present();
      }     

    }, err => { 
        return; 
    }); 
    
  }

  //Abre uma nova página de profile
  goToProfile($user_id:number){
    this.navCtrl.push('ProfilePage', {
      user_id: $user_id
    }); 
  }


}
