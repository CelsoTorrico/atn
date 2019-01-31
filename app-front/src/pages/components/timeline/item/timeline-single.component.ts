import { ToastController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../../providers';

@Component({
  selector: 'timeline-single',
  templateUrl: 'timeline-single.html',
  styles: [`
    ion-note{
      margin: auto 0px auto auto;
      display: inline-block;
      float: right;
    }
  `]
})
export class TimelineSingle{

  public $postID:number;
  
  @Input() public currentTimeline:any = {
    ID: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: {}
    },
    post_date: '',
    post_content: '',
    attachment: '',
    quantity_comments: ''
  }; 

  public commentText:string; 

  public commentShow:any;

  constructor(
    private toastCtrl: ToastController,
    private api: Api,
    private navCtrl:NavController) {} 

  //Retorna
  ngOnInit() {
    
  }

  //Carregar comentários
  setLike($postID:number, event) {
    
    event.preventDefault();

    this.api.get('like/' + $postID).subscribe((resp:any) => {
        
      if(resp.success != undefined){
          let el = event.target.parentNode;
          if(el.classList.contains("active")){ 
            el.classList.remove("active");
            el.classList.add("inactive");
          } else { 
            el.classList.add("active")
            el.classList.remove("inactive"); 
          }
      }

    });

  }

  //Mostrar campo de comentário
  openComment(event) {
    event.preventDefault();
    this.commentShow = true;
  }

  //Deletar um comentário
  deleteTimeline($postID:number, $event) {
    
  }

  
  //Submeter um comentário ao post
  submitComment($postID:number, $event) {
    
    $event.preventDefault();

    //Só submeter quando clicar em Enter
    if ($event.code != 'Enter') { 
        return;
    }

    //Enviado um comentário a determinada timeline
    let items = this.api.post('timeline/'+ $postID, {comment_content : this.commentText}).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length <= 0){
        return;
      }

      //Sucesso 
      if(resp.success != undefined){

        //Reseta formulário e esconde
        this.commentText = '';
        this.commentShow = false;
        
        let toast = this.toastCtrl.create({
          message: resp.success.comment,
          duration: 8000,
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
