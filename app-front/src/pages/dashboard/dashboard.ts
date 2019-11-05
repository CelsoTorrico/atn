import { environment } from './../../environments/environment.prod';
import { MemberCurrentMenu } from './../components/menu/member-current-menu';
import { DashboardLastActivityService } from './dashboardactivity.service';
import { VisibilityList } from '../../providers/visibility/visibility';
import { NgForm } from '@angular/forms';
import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { User, Api, Cookie } from '../../providers';
import { Timeline } from '../components/timeline/timeline';
import { PushNotifyService } from '../../providers/notification/notification';
import { MemberUser } from '../components/member/item/member-current-user';
import { Notify } from '../components/notify/notify';

@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {

    @ViewChild(Timeline) timeline: Timeline;
    @ViewChild(MemberCurrentMenu) currentMenu: MemberCurrentMenu;
    @ViewChild(MemberUser) currentUser: MemberUser;
    @ViewChild(Notify) notify: Notify;
    @ViewChild('post_image_timeline') inputFile;

    public loginErrorString;
    public timeline_placeholder: string;
    public loading_placeholder: string;
    protected interval;

    //Informações básicas de usuário
    public currentUserData: any = {
        ID: '',
        display_name: '',
        user_login: '',
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

    //Botão de recarregar
    public btn_refresh = false;

    //Visibilidade
    public visibility: any[];

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

    constructor(
        public navCtrl: NavController,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        private loading: LoadingController,
        public push: PushNotifyService,
        private user: User,
        private lastActivity: DashboardLastActivityService,
        visibilityList: VisibilityList) {

        this.translateService.setDefaultLang('pt-br');

        this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
            this.timeline_placeholder = data.POST;
            this.loading_placeholder = data.LOADING;
        });

        //Carrega campos de visibilidade
        visibilityList.load().then((success) => {
            //Atribui dados ao modelo
            this.visibility = visibilityList.table;
        });

        //Habilitar popup para permissão de notificação
        this.push.requestDesktopNotificationPermission();

    }

    //Função que inicializa
    ngOnInit() {

        /** Verifica se usuário já esta logado anteriormente na plataforma */
        this.user.isLoggedUser().then((resp: boolean) => {
            //Redireciona para a página de Login
            if (!resp) {
                return this.user.logout();
            }
        }); 

    }

    ionViewDidLoad() {
        
    }

    ngAfterContentInit() {
        this.doRefresh();
    }

    /* Popula a propriedade da classe*/
    private populateProperties() {
        
        //Adicionando dados de usuário logado
        this.currentUserData = this.user._user;

        //Atribui dados a componentes filhos
        this.currentUser.member = this.currentUserData;
        this.currentMenu.user = this.user;

        //Carrega dados das infos do painel
        this.setViews();
    }

    //Recarrega dados
    doRefresh($refreshEvent:any = null) {

        this.user.getUserData().then((resp:any) => {

            if (!resp) return;

            //Recarregando dados da dashboard
            this.populateProperties();
            this.timeline.loadLasts();
            this.notify.query();
            this.getLastActivity(); 

            if ($refreshEvent != null) {
                //Fecha loading
                $refreshEvent.complete();
            }

            //Limpa interval e esconde botão
            clearInterval(this.interval);

            //Mostrar botao de reloading em tempos em tempos
            this.interval = setInterval(() => {
                this.doRefresh();           
            }, 1000 * 60);

        });        

    }

    //Abrir dialogo de input de arquivo de imagem
    openFileInput($event) {
        $event.preventDefault();
        let fileInput = document.getElementById('post_image_timeline');
        fileInput.click();
    }

    //Quando um input tem valor alterado
    fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e: any) {
                let preview = document.getElementById('post_image_timeline_preview');
                preview.style.backgroundImage = 'url(' + e.target.result + ')';
                preview.style.display = 'block';
            }

            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    //Carrega as últimas atividades
    private getLastActivity() {
        //Carrega as últimas atividades
        this.lastActivity.load().then(() => {
            this.activity = this.lastActivity.list;
        })
    }

    //Retorna dados do usuário
    private setViews() {

        //Se não houver dados ainda
        if (this.user._user == undefined) {
            return;
        }

        this.info.views     = (this.user._user.metadata != undefined)? this.checkNull(this.user._user.metadata.views.value, this.info.views) : 0;

        this.info.messages  = this.checkNull(this.user._user.totalMessages, this.info.messages);
        
        this.info.favorite  = this.checkNull(this.user._user.totalFavorite, this.info.favorite);
        
        this.info.notifications = this.checkNull(this.user._user.totalNotifications, this.info.notifications);
    }

    private checkNull($data, $valueToExibit) {
        //Se data for nulo ou indefinido
        if ($data == null || $data == undefined) {
            return $valueToExibit;
        }
        //Retorna data normal
        return $data;
    }


    /**
     * Adicionar um novo item de timeline
     */
    addItem(form: NgForm, $event) {

        $event.preventDefault();

        //Carregando
        const loading = this.loading.create({
            content: this.loading_placeholder
        });

        loading.present();

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

            loading.dismiss();

            //Se sucesso
            if (resp.success != undefined) {

                //Reseta campos de atualização de timeline
                this.addTimeline.post_content = '';
                this.addTimeline.post_image = null;

                //Reseta container de foto
                this.preview = document.getElementById('post_image_timeline_preview');
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

    //Abre uma nova página
    goToBenefitSite($event) {

        $event.preventDefault();

        //Carregando
        const loading = this.loading.create({
            content: this.loading_placeholder
        });

        loading.present();
        
        this.api.get('user/benefits').subscribe((resp: any) => {

            loading.dismiss();

            //Se erro, mostrar erro
            if (resp.error != undefined) {

                let toast = this.toastCtrl.create({
                    message: resp.error.affinibox,
                    showCloseButton: true,
                    position: 'bottom'
                });

                return toast.present();
            }

            //Se houve sucesso de login na plataforma > redirecionar
            if(resp.success){
                return window.open(resp.link, '_blank');
            }            

        });
    }

    //Abre uma nova página de profile
    goToProfile($user_id:number, $user_login:string = '') {

        //Atribuir argumentos de usuário na navegação em caso de profile
        let $data = { user_id: $user_id, user_login: $user_login };

        this.navCtrl.push('Profile', $data);
    }

}
