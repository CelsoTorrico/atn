import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, ToastController } from 'ionic-angular';
import { User } from '../../../providers';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'user-menu',
  template: `
        <button ion-button clear icon-only class="learn-icon" (click)="goToPage('LearnPage')">
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
    public user: User,
    private cookieService: CookieService) { }

  //Função que inicializa
  ngOnInit() {

  }

  //Abre uma nova página
  goToPage($page: string, $data: any) {
    this.navCtrl.push($page, { currentUser: $data });
  }

  //Abre uma nova página
  doLogout() {
    //Atribuindo observable
    let logoutObservable = this.user.logout();

    //Subscreve sobre a requisição
    logoutObservable.subscribe((resp: any) => {
      if (resp.success) {
        
        let toast = this.toastCtrl.create({
          position: 'bottom',
          message: resp.success.logout,
          duration: 3000
        })

        //Exclui dados do cookie
        this.cookieService.delete('app_atletas_now');

        toast.present({
          ev: this.navCtrl.push('LoginPage')
        });

      }
    });

  }

}
