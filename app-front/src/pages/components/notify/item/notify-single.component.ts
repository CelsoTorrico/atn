import { ToastController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../../providers';

@Component({
  selector: 'notify-single',
  templateUrl: 'notify-single.html',
  styles: [`
    ion-note{
      margin: auto 0px auto auto;
      display: inline-block;
      float: right;
    }
  `]
})
export class NotifySingle{

  public $postID:number;
  
  @Input() public currentNotify:any = {
    ID: <number>null,
    user_profile: {
      ID: <string>null,
      display_name: <string>"",
      profile_img: {
        value:<string>""
      }
    },
    message:<string>""
  }; 

  constructor(
    private toastCtrl: ToastController,
    private api: Api,
    private navCtrl:NavController) {} 

  //Retorna
  ngOnInit() {
    
  }

  //Deletar um comentário
  hideNotify($postID:number, $event) {
    
  }
  
  //Submeter um comentário ao post
  approveNotify($postID:number, $event) {
    
    $event.preventDefault();

    //Só submeter quando clicar em Enter
    if ($event.code != 'Enter') { 
        return;
    }

    //Enviado um comentário a determinada timeline
    let items = this.api.post('timeline/'+ $postID, {comment_content : ''}).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length <= 0){
        return;
      }

      //Sucesso 
      if(resp.success != undefined) {
        
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
