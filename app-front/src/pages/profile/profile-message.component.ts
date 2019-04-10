import { ToastController, NavParams } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Api } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'profile-message',
  template: `
      <div id="#profile-message" class="ion-card">

          <ion-list>

            <ion-item>
              <h3>{{ "SEND_AN_EMAIL_TO_PROFILE" | translate }} {{ $display_name }}</h3>
            </ion-item>           

            <ion-item>
              <ion-label stacked>{{ "YOUR_MESSAGE" | translate }}</ion-label>
              <ion-textarea name="comment_content" [(ngModel)]='messageText' placeholder="{{ 'YOUR_MESSAGE' | translate }}" required ></ion-textarea>
            </ion-item>
            
            <ion-item>
              <button ion-button block end (click)="submitMessage($event)">{{ "PUBLISH" | translate }}</button>
            </ion-item>

          </ion-list>    
        
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
      box-shadow: -10px -15px 100px 50px rgba(0,0,0,0.2);
      z-index: 1000000;
    }
  `]
})
export class ProfileMessage {

  @Input() public $user_ID: number;
  @Input() public $display_name: string;

  public messageText: string;

  constructor(
    private toastCtrl: ToastController,
    private api: Api,
    private viewer: ViewController,
    public translateService: TranslateService) { 
      this.translateService.setDefaultLang('pt-br'); 
    }

  //Retorna
  ngOnInit() {

  }

  //Submeter um comentário ao post
  submitMessage($event) {

    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    let items = this.api.post('user/message/' + this.$user_ID, { message_content: this.messageText }).subscribe((resp: any) => {

      //Se não existir items a exibir
      if (Object.keys(resp).length <= 0) {
        return;
      }

      //Sucesso 
      if (resp.success != undefined) {

        //Reseta formulário e esconde
        this.messageText = '';

        let toast = this.toastCtrl.create({
          message: resp.success.email,
          duration: 8000,
          position: 'bottom'
        });

        toast.present();
      }

    }, err => {
      return;
    });

  }

  //Abre uma nova página de profile
  dismiss() {
    this.viewer.dismiss();
  }


}