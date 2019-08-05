import { loadNewPage } from './../../../providers/load-new-page/load-new-page';
import { CookieService } from 'ng2-cookies';
import { ToastController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Cookie, User, Api } from '../../../providers';

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

    @Input() user: User
    pages: any

    @Input() messageCount: number = 0;

    constructor(
        public  navCtrl: NavController,
        private toastCtrl: ToastController,
        public  translateService: TranslateService,
        api: Api,
        loadNewPage: loadNewPage) {

        //Se classe user não estiver instanciada
        if (this.user == undefined) {
            this.user = new User(api, loadNewPage, toastCtrl)
        }

        this.translateService.setDefaultLang('pt-br');

        // used for an example of ngFor and navigation
        this.pages = {
            "MY_PROFILE": "Profile",
            "FAVORITE": "Favorite",
            "LEARN": "Learn",
            "MESSAGES": "Chat",
            "SEARCH": "Search",
            "CONFIGURATION": "Settings",
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
        
        //Subscreve sobre a requisição
        if(this.user == undefined) {
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

    private logoutMessageRedirect(resp:string){
        
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
