import { loadNewPage } from './../../providers/load-new-page/load-new-page';
import { NgForm } from '@angular/forms';
import { Component, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User, Api, Cookie } from '../../providers';
import { CookieService } from 'ng2-cookies';


@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {

    public loginErrorString;
    public timeline_placeholder: string;

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

    //Preview Foto
    public preview: any;

    //Atividades
    public activity: any[] = [];

    //Informações de visualização
    public info: any = {
        views: <number>0,
        messages: <number>0,
        favorite: {
            myFavorites: <number>0,
            otherFavorite: <number>0
        },
        notifications: <number>0
    }

    private user: User;

    constructor(
        public navCtrl: NavController,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public loadNewPage: loadNewPage,
        private cookieService: CookieService) {

        this.translateService.setDefaultLang('pt-br');

        this.translateService.get("POST").subscribe((data) => {
            this.timeline_placeholder = data;
        });

        //Instanciando classe 'User' desse modo, devido imcompatibilidade dentro do construtor
        this.user = new User(this.api, this.loadNewPage, this.toastCtrl);
    }

    ionViewDidLoad() {  
        //Verifica existência do cookie e redireciona para página
        Cookie.checkCookie(this.cookieService, this.navCtrl);
    }

    //Função que inicializa
    ngOnInit() {

        this.currentUser();
        this.getVisibility();
        this.getLastActivity();
    }

    //Recarrega dados
    doRefresh($refreshEvent){
        
        this.currentUser();
        this.getLastActivity();

        setTimeout(() => {
            $refreshEvent.complete();
          }, 2000);
        
    }

    //Quando um input tem valor alterado
    fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            
            var reader = new FileReader();

            reader.onload = function (e: any) {
                let preview = document.getElementById('preview');
                preview.style.backgroundImage = 'url(' + e.target.result + ')';
                preview.style.display = 'block';
            }

            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    //Retorna dados do usuário
    public currentUser() {

        this.user.subscribeUser(function ($this) {

            //Adicionando valores a variavel global
            $this.currentUserData = $this.user._user;

            //Campos específicos para dados básicos
            $this.info.views = $this.checkNull($this.user._user.metadata.views.value, $this.info.views );
            $this.info.messages = $this.checkNull($this.user._user.totalMessages, $this.info.messages);
            $this.info.favorite = $this.checkNull($this.user._user.totalFavorite, $this.info.favorite);
            $this.info.notifications = $this.checkNull($this.user._user.totalNotifications, $this.info.notifications);

        }, this);

    }

    checkNull($data, $valueToExibit) {
        //Se data for nulo ou indefinido
        if ($data == null || $data == undefined) {
            return $valueToExibit;
        }

        //Retorna data normal
        return $data;
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

        if ($event.target[2].files[0] != undefined) {
            //O campo de imagem deve permanecer na ordem
            let file = $event.target[2].files[0];
            formData.append('post_image', file, file.name);
        }

        formData.append('post_content', this.addTimeline.post_content);
        formData.append('post_visibility', this.addTimeline.post_visibility);

        //Para envio de imagens {{ options }}
        this.api.post('/timeline', formData).subscribe((resp: any) => {

            //Se sucesso
            if (resp.success != undefined) {

                //Reseta campos de atualização de timeline
                this.addTimeline.post_content = '';
                this.addTimeline.post_image = null;

                //Reseta container de foto
                this.preview = document.getElementById('preview');
                this.preview.style.backgroundImage = 'none';
                this.preview.style.display = 'none';

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
    goToProfile($user_id: number) {
        this.navCtrl.push('ProfilePage', {
            user_id: $user_id
        });
    }

}
