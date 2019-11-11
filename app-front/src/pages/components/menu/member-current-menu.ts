import { loadNewPage } from './../../../providers/load-new-page/load-new-page';
import { ToastController, LoadingController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Cookie, User, Api } from '../../../providers';
import { Storage } from '@ionic/storage';

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


    pages: any

    @Input() public member:any = {
        ID: "",
        user_login: "",
        display_name: ""
    };

    @Input() messageCount: number = 0;

    loading_placeholder: string

    constructor(
        public navCtrl: NavController,
        private toastCtrl: ToastController,
        public translateService: TranslateService,
        private loading: LoadingController,
        private user: User,
        api: Api,
        loadNewPage: loadNewPage,
        cache:Storage) {

        this.translateService.setDefaultLang('pt-br');

        this.translateService.get('LOADING').subscribe((data: any) => {
            this.loading_placeholder = data;
        });

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

        //Inscrever requisição de dados de usuario
        this.user.dataReady.subscribe((resp) => {
            this.member = this.user._user;
        });
    }

    ngOnInit() {
        
    }

    ionViewDidLoad() {

    }

    //Abre uma nova página de profile
    goToPage($page: string) {

        //Atribuir argumentos de usuário na navegação em caso de profile
        let $data = ($page == 'Profile')? { 
            user_id: this.member.ID, 
            user_login: this.member.user_login 
        } : {};

        this.navCtrl.push($page, $data);
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
