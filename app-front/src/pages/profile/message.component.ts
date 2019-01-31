import { ToastController, NavParams } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Api } from '../../providers';

@Component({
  selector: 'message',
  template: `
        <ion-col col-2>
            <ion-list>
                <ion-item>
                    <ion-avatar item-start>
                        <ion-img [src]=""></ion-img>
                    </ion-avatar>
                </ion-item>
            </ion-list>                            
            </ion-col>
            <ion-col>                            
            <ion-item>
                <ion-textarea name="comment_content" [(ngModel)]='messageText' placeholder="{{ 'YOUR_MESSAGE' | translate }}" required (keyup)='submitMessage($event)' ></ion-textarea>
            </ion-item>                
        </ion-col> 
  `,
  styles: [`
    
  `]
})
export class Message{

  public $ID:number;
  
  public messageText:string; 

  constructor(
    private toastCtrl: ToastController,
    private api: Api,
    private navCtrl:NavController,
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
    let items = this.api.post('user/message/'+ this.$ID, {message_content : this.messageText}).subscribe((resp:any) => {
       
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