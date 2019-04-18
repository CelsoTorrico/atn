import { CookieService } from 'ng2-cookies';
import { ToastController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../providers';

@Component({
    selector: 'member-current-menu',
    template: `
    
    <ion-list>
        <button ion-item *ngFor="let nav of pages | mapToIterable " (click)="goToPage(nav.val)">
            {{ nav.key | translate }}
            <ion-badge class="messageCount" *ngIf="nav.key == 'MESSAGES' && messageCount > 0">
                {{ messageCount }}
            </ion-badge>
        </button>
        
        <button ion-item class="btn-cursor" (click)="doLogout()">{{ "LOGOUT" | translate }}</button>
        
    </ion-list> 
  `,
    styles: [``]
})
export class MemberCurrentMenu { 

    pages: any;

    @Input() messageCount:number = 0;

    constructor(
        public navCtrl: NavController,
        private user: User,
        private toastCtrl: ToastController,
        public translateService: TranslateService,
        private cookieService: CookieService) {

        this.translateService.setDefaultLang('pt-br');

        // used for an example of ngFor and navigation
        this.pages = {
            "MY_PROFILE": "ProfilePage",
            "FAVORITE"  : "FavoritePage",
            "LEARN"     : "LearnPage",
            "MESSAGES"  : "ChatPage",
            "SEARCH"    : "SearchPage",
            "CONFIGURATION" : "SettingsPage", 
            "FAQ"       : "",
            "SUPPORT"   : ""
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

                //Exibe mensagem
                let toast = this.toastCtrl.create({
                    position: 'bottom',
                    message: resp.success.logout,
                    duration: 3000
                });

                //Exclui dados do cookie
                this.cookieService.delete('app_atletas_now'); 

                toast.present({
                    ev: this.navCtrl.setRoot('LoginPage')
                });

            }
        });
    }

}
