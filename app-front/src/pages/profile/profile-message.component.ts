import { ToastController, NavParams } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Api } from '../../providers';

@Component({
  selector: 'profile-message',
  template: `
      <div id="#profile-message" class="ion-card">
        
          <ion-item>
              <ion-title>
                {{ "Envie uma mensagem para " | translate }} {{ $display_name }}
              </ion-title>
              <ion-avatar item-start>
                    <ion-img [src]=""></ion-img>
                </ion-avatar>
              <ion-textarea name="comment_content" [(ngModel)]='messageText' placeholder="{{ 'YOUR_MESSAGE' | translate }}" required (keyup)='submitMessage($event)' ></ion-textarea>
          </ion-item>                
        
      </div>
  `,
  styles: [`
    .ion-card{
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 15px;
      display: block;
      position: fixed;
      right: 30px;
      bottom: 30px;
      box-shadow: 1px 1px 60px rgba(0,0,0,0.1);
    }
  `]
})
export class ProfileMessage{

  @Input() public $user_ID:number;
  @Input() public $display_name:string;
  
  public messageText:string; 

  constructor(
    private toastCtrl: ToastController,
    private api: Api,
    private viewer: ViewController) {} 

  //Retorna
  ngOnInit() {
    
  }
  
  //Submeter um comentário ao post
  submitMessage($event) {
    
    $event.preventDefault();

    //Só submeter quando clicar em Enter
    if ($event.code != 'Enter') { 
        return;
    }

    //Enviado um comentário a determinada timeline
    let items = this.api.post('user/message/'+ this.$user_ID, {message_content : this.messageText}).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length <= 0){ 
        return;
      }

      //Sucesso 
      if(resp.success != undefined){

        //Reseta formulário e esconde
        this.messageText = '';
        
        let toast = this.toastCtrl.create({
          message: resp.success.message,
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
  dismiss(){
    this.viewer.dismiss(); 
  }


}