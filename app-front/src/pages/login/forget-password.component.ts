import { ToastController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Api } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'forget-password',
  template: `

  <ion-content>

    
    
      <ion-list>

        <h1>{{ "FORGET_PASSWORD" | translate }}</h1>
      
        <p>{{ "PUT_YOUR_EMAIL_AND_RECEIVE_A_NEW_PASS" | translate }}</p>

        <form #loginForm="ngForm" name='form' (ngSubmit)="submitChangePass($event)">

          <ion-item no-padding>
            <ion-label fixed>{{ 'EMAIL' | translate }}</ion-label>
            <ion-input type="email" [(ngModel)]="user_email" name="user_email" required></ion-input>
          </ion-item>

          <ion-item no-padding>
            <button color="danger" ion-button block>{{ 'SUBMIT_BUTTON' | translate }}</button>
          </ion-item>

          <ion-item *ngIf="$error">
            {{ $error }}
          </ion-item>
        
        </form>

      </ion-list>

  </ion-content>    
  `,
  styles: [`
  ion-list{
    margin: 50px 100px;
  }

  p{
    font-weight: 100;
  }
  `]
})
export class ForgetPasswordComponent {

  user_email: string;

  $error: string;

  constructor(
    private toastCtrl: ToastController,
    private api: Api,
    public translateService: TranslateService) { 
      this.translateService.setDefaultLang('pt-br'); 
    }

  //Retorna
  ngOnInit() {

  }

  //Submeter um comentário ao post
  submitChangePass($event) {

    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    let items = this.api.post('forget-pass', { user_email: this.user_email }).subscribe((resp: any) => {

      //Se não existir items a exibir
      if (Object.keys(resp).length <= 0) {
        return;
      }

      //Retornou erro
      if (resp.error != undefined) {
        return false;
      }

      //Reseta formulário e esconde
      this.user_email = '';

      let toast = this.toastCtrl.create({
        message: resp.success['forget-password'],
        duration: 8000,
        position: 'bottom'
      });

      toast.present();

    }, err => {
      return;
    });

  }

  //Abre uma nova página de profile
  dismiss() {

  }


}
