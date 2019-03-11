import { ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../providers';

@Component({
    selector: 'member-current-menu',
    template: `
    
    <ion-list>
        <button ion-item *ngFor="let nav of pages | mapToIterable " (click)="goToPage(nav.val)">{{ nav.key | translate }}</button>
        
        <button ion-item class="btn-cursor" (click)="doLogout()">{{ "LOGOUT" | translate }}</button>
        
    </ion-list> 
  `,
    styles: [``]
})
export class MemberCurrentMenu {

    pages: any;

    constructor(
        public navCtrl: NavController,
        private user: User,
        private toastCtrl: ToastController,
        public translateService: TranslateService) {

        this.translateService.setDefaultLang('pt-br');

        // used for an example of ngFor and navigation
        this.pages = {
            "MY_PROFILE": "ProfilePage",
            "FAVORITE": "FavoritePage",
            "LEARN": "LearnPage",
            "MESSAGES": "ChatPage",
            "SEARCH": "SearchPage",
            "FAQ": "",
            "SUPPORT": ""
        };
    }

    ionViewDidLoad() {

    }

    //Abre uma nova página de profile
    goToPage($page: string) {
        this.navCtrl.push($page, { user_id: null });
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

                toast.present({
                    ev: this.navCtrl.push('LoginPage')
                });

            }
        });
    }

}
