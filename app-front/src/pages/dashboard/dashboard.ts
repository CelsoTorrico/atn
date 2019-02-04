import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User, Api } from '../../providers';


@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {

    public loginErrorString;

    public currentUserData: any = { 
        ID: '',
        display_name: '',
        metadata: {
            profile_img: {
                value: ''
            }
        }
    };

    public addTimeline: any = {
        post_content: <string>'',
        post_visibility: <number>0, 
        post_image: <any>null,
    }

    public visibility: string[];

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }

    //Função que inicializa
    ngOnInit() {
        this.currentUser();
        this.getVisibility();
    }

    public currentUser() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.user._user = this.api.get('user/self').subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores a variavel global
            this.currentUserData = resp;

        }, err => {
            return;
        });

        return this.currentUserData;

    }

    getVisibility() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get('timeline/visibility').subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length > 0) {

                this.visibility = resp;

            }

        }, err => {
            return;
        });

    }

    /**
     * Adicionar um novo item de timeline
     */
    addItem(form: NgForm, $event) {

        //O campo de imagem deve permanecer na ordem
        let file = $event.target[2].files[0];
        
        //Convertendo data em objeto FormData
        let formData = new FormData();
        formData.append('post_image', file, file.name);
        formData.append('post_content',     this.addTimeline.post_content);
        formData.append('post_visibility',   this.addTimeline.post_visibility);

        //Para envio de imagens {{ options }}
        this.api.post('/timeline', formData).subscribe((resp: any) => {

            if (resp.success != undefined) {

                let toast = this.toastCtrl.create({
                    message: resp.success.timeline,
                    duration: 4000,
                    position: 'bottom'
                });

                toast.present();

            }

        });
    }

    //Abre uma nova página de profile
    goToPage($page: string, $data: any) {
        this.navCtrl.push($page, { currentUser: $data });
    }

}
