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

    //Informações básicas de usuário
    public currentUserData: any = { 
        ID: '',
        display_name: '',
        metadata: {
            profile_img: { 
                value: ''
            }
        }
    };

    //Timeline
    public addTimeline: any = {
        post_content: <string>'',
        post_visibility: <number>0, 
        post_image: <any>null,
    }

    //Visibilidade
    public visibility: string[];

    //Atividades
    public activity:any[] = [];

    //Informações de visualização
    public info:any = {
        views: <number>null,
        messages: <number>null,
        favorite: <any>[]
    }

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
        this.getLastActivity();
    }

    //Retorna dados do usuário
    public currentUser() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.user._user = this.api.get('user/self').subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores a variavel global
            this.currentUserData = resp;
            
            //Campos específicos para dados básicos
            this.info.views = resp.metadata.views.value;
            this.info.favorite = resp.totalFavorite;
            this.info.messages = resp.totalMessages; 

        }, err => {
            return;
        });

        return this.currentUserData;

    }

    //Retorna dados de visibilidade
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

    //Retorna as últimas atividades
    getLastActivity() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get('timeline/activity').subscribe((resp: any) => {
            //Se não existir items a exibir
            if (resp.length > 0) {
                this.activity = resp;
            }
        }, err => {
            return;
        });
    }

    /**
     * Adicionar um novo item de timeline
     */
    addItem(form: NgForm, $event) {

        //Convertendo data em objeto FormData
        let formData = new FormData();

        if ($event.target[2].files[0] != undefined){
            //O campo de imagem deve permanecer na ordem
            let file = $event.target[2].files[0];
            formData.append('post_image', file, file.name); 
        }
        
        formData.append('post_content',     this.addTimeline.post_content);
        formData.append('post_visibility',   this.addTimeline.post_visibility);

        //Para envio de imagens {{ options }}
        this.api.post('/timeline', formData).subscribe((resp: any) => {

            //Se sucesso
            if (resp.success != undefined) {

                //Reseta campos de atualização de timeline
                this.addTimeline.post_content = '';
                this.addTimeline.post_image = null;

                //Mostrar alerta de sucesso
                let toast = this.toastCtrl.create({
                    message: resp.success.timeline,
                    duration: 4000,
                    position: 'bottom'
                });

                toast.present();
            }

            //Se erro, mostrar erro
            if (resp.error != undefined) {

                let toast = this.toastCtrl.create({
                    message: resp.error.timeline,
                    showCloseButton: true,
                    position: 'bottom'
                });

                toast.present();
            }

        });
    }

    //Abre uma nova página
    goToPage($page: string, $data: any) {
        this.navCtrl.push($page, { currentUser: $data });
    }

    //Abre uma nova página de profile
    goToProfile($user_id:number){
        this.navCtrl.push('ProfilePage', {
        user_id: $user_id
        }); 
    }

}
