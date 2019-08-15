import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, ToastController, LoadingController } from 'ionic-angular';
import { User, Cookie } from '../../../providers';
import { CookieService } from 'ng2-cookies';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

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

  loading_placeholder: string

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private translateService: TranslateService,
    private loading: LoadingController,
    public user: User) {

    this.translateService.get('LOADING').subscribe((data: any) => {
      this.loading_placeholder = data;
    })

  }

  //Função que inicializa
  ngOnInit() {

  }

  //Abre uma nova página
  goToPage($page: string, $data: any) {
    this.navCtrl.push($page, { currentUser: $data });
  }

  //Faz logout na plataforma
  doLogout() {

    //Criando loader
    let loading = this.loading.create({ content: this.loading_placeholder });
    loading.present().then(() => {
      //Logout no caso de classe user setada corretamente
      this.user.logout();
    });

  }

}
