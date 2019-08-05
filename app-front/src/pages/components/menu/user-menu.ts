import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, ToastController } from 'ionic-angular';
import { User, Cookie } from '../../../providers';
import { CookieService } from 'ng2-cookies';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'user-menu',
  template: `
        <button ion-button clear icon-only class="learn-icon" (click)="goToPage('Learn')">
            <img src="assets/img/dashboard/learn-icon.png"/>
        </button>

        <button ion-button clear icon-only class="logout-icon" (click)="doLogout()">
            <img src="assets/img/dashboard/logout-icon.png"/>
        </button>
  `,
  styles: [``]
})
export class UserMenu {

  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public user: User) {
      
  }

  //Função que inicializa
  ngOnInit() {

  }

  //Abre uma nova página
  goToPage($page: string, $data: any) {
    this.navCtrl.push($page, { currentUser: $data });
  }

  //Abre uma nova página
  doLogout() {

    //Subscreve sobre a requisição
    if (this.user == undefined) {
      //Remoove cookie do browser
      Cookie.deleteCookie();
      return this.logoutMessageRedirect('Você foi deslogado.');
    }

    //Logout no caso de classe user setada corretamente
    this.user.logout().then((resp: any) => {
      if (resp.success) {
        //Faz o logout
        this.logoutMessageRedirect(resp.success.logout);
      }
    });

  }

  private logoutMessageRedirect(resp: string) {

    //Exibe mensagem
    let toast = this.toastCtrl.create({
      position: 'bottom',
      message: resp,
      duration: 3000
    });

    toast.present().then((res) => {
      //Aguarda 3 segundos para redirecionar
      setTimeout(() => {
        window.location.assign(environment.apiOrigin);
      }, 1000 * 3)

    });
  }

}
