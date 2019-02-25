import { loadNewPage } from './../../../../providers/load-new-page/load-new-page';
import { ToastController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../../providers';

@Component({
  selector: 'notify-single',
  templateUrl: 'notify-single.html',
  styles: [`
    
    ion-card{
      position:relative;
    }
  `]
})
export class NotifySingle {

  public $postID: number;

  @Input() public currentNotify: any = {
    ID: <number>null,
    user_profile: {
      ID: <string>null,
      display_name: <string>"",
      profile_img: {
        value: <string>""
      }
    },
    message: <string>""
  };

  constructor(
    private api: Api,
    private navCtrl: NavController,
    private msg: loadNewPage) { }

  //Retorna
  ngOnInit() {

  }

  //Deletar um comentário
  hideNotify($postID: number, $event) {
    
    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    let items = this.api.delete('notify/' + $postID).subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Sucesso 
      if (resp.success != undefined) {
        
      }

    }, err => {
      return;
    });
  }

  //Submeter um comentário ao post
  approveCertify($postID: number, $resp: number, $event) {

    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    let items = this.api.post('notify/' + $postID, { confirm: $resp }).subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      //Sucesso 
      if (resp.success != undefined) {
        let toast = this.msg.createToast(resp.success.approve_notify, "bottom");
        toast.present();
      }

      //Error 
      if (resp.error != undefined) {
        let toast = this.msg.createToast(resp.success.approve_notify, "bottom");
        toast.present();
      }

    }, err => {
      return;
    });

  }

  //Abre uma nova página de profile
  goToProfile($user_id: number) {
    this.navCtrl.push('ProfilePage', {
      user_id: $user_id
    });
  }


}
