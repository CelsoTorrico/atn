import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { ChartComponent } from 'angular2-chartjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'profile-resume',
    templateUrl: "profile-resume.html",
})
export class ProfileResumeComponent { 

    @Input() user:User;

    @Input() isLogged: boolean;

    @Output() changeViewEvent = new EventEmitter<any>();

    @ViewChild(ChartComponent) chart: ChartComponent;

    ID: number = null;

    type: any = {
        ID: null,
        type: null
    };

    display_name: string = null;

    profile_img: string = null;

    posicao: string = null;

    favorite: boolean = false;

    birthdate: string = null;

    sport: any[] = [
        { ID: null, sport_name: null }
    ];

    career:any = {
        value: null
    }

    height: number = null;

    weight: number = null;

    jogos: number = null;

    aproveitamento: any = {
        value: null
    }

    public views: any[] = null;
    public adminViews:any[] = null;
    enableAdminClubButton:boolean = false;

    /** Upload de Photo */
    uploadPhoto: any;
    public loading_placeholder: string;

    //Chart - Estatistica
    // Pie
    typeChart = 'doughnut';
    data = {
        labels: ["Vitórias", "Empates", "Derrotas"],
        datasets: [
            {
                label: "",
                data: [0, 0, 0],
                backgroundColor: ['green', 'yellow', 'red'],
                borderWidth: [0, 0, 0],
                borderColor: ['rgba(0,0,0,0)']
            }
        ]
    };
    options = {
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    constructor(
        public navCtrl: NavController,
        private api: Api,
        private toastCtrl: ToastController,
        public translateService: TranslateService,
        private loading: LoadingController) {

        this.translateService.setDefaultLang('pt-br');

        this.translateService.get("LOADING").subscribe((data) => {
            this.loading_placeholder = data;
        });

        // used for an example of ngFor and navigation
        this.views = [
            { title: 'PROFILE', component: 'personalView' },
            { title: 'STATS',   component: 'statsView' }
        ];

        // telas de admin de usuário
        this.adminViews = [
            { title: 'MY_CLUB', component: 'clubView' }
        ];

    }

    ngAfterViewChecked() {
        
    }

    //Adiciona valores a propriedades da classe
    loadUserData($userdata:any) {

        //Adicionando valores as variavel global
        let atributes = $userdata; 

        //Atribuindo dados aos modelos
        this.ID = atributes.ID;
        this.display_name = atributes.display_name;
        if (atributes.type      != null) this.type = atributes.type;
        if (atributes.sport     != null) this.sport = atributes.sport;
        this.favorite = atributes.favorite;

        if (atributes.metadata.hasOwnProperty('profile_img')) {
            this.profile_img = atributes.metadata.profile_img.value;
        }

        if (atributes.metadata.hasOwnProperty('height')) {
            this.height = atributes.metadata.height.value;
        }

        if (atributes.metadata.hasOwnProperty('weight')) {
            this.weight = atributes.metadata.weight.value;
        }

        if (atributes.metadata.hasOwnProperty('birthdate')) {
            this.birthdate = atributes.metadata.birthdate.value;
        }

        if (atributes.metadata.hasOwnProperty('posicao')) {
            this.posicao = atributes.metadata.posicao.value;
        }

        if (atributes.metadata.hasOwnProperty('career')) {
            this.career = atributes.metadata.career;
        }

        //Adicionar botão de "Meu Clube"
        if (this.type.ID > 2 && this.isLogged) {
            //Habilita botão de admin
            this.enableAdminClubButton = true;
        }

        //Pega os dados de estatística 
        this.getStats();

    }

    /** Retorna as estatisticas de usuário */
    private getStats() {

        //Retorna dados de estatística
        this.user._statsObservable.subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            if (resp.error != undefined) {
                return;
            }

            //Adicionando valores as variavel global
            let atributes = resp;

            //Verifica se existe propriedades
            if (Object.keys(atributes.general).length > 0) {
                for (const keys in atributes.general) {
                    if (this.hasOwnProperty(keys)) {
                        this[keys] = atributes.general[keys];
                    }
                }
            }

            this.data.datasets[0].data = [
                Number(this.aproveitamento['%-vitorias']),
                Number(this.aproveitamento['%-empates']),
                Number(this.aproveitamento['%-derrotas']),
            ]

            this.chart.chart.update();

        }, err => {
            return;
        });
    }

    //Abrir dialogo de input de arquivo de imagem
    openFileInput($event) {
        $event.preventDefault();
        let fileInput = document.getElementById('update-photo');
        fileInput.click();
    }

    changePhoto($event) {

        if ($event.target.files[0] == undefined) {
            return false;
        }

        //Carregando
        const loading = this.loading.create({
            content: this.loading_placeholder
        });

        loading.present();

        //Convertendo data em objeto FormData
        let formData = new FormData();

        //O campo de imagem deve permanecer na ordem
        let file = $event.target.files[0];
        formData.append('profile_img', file, file.name);

        //Para envio de imagens {{ options }}
        let changePhotoObservable = this.user.update(formData, true);
        changePhotoObservable.subscribe((resp: any) => {

            loading.dismiss(); 

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) {
                return;
            }

            //Se houve erro
            if (resp.error != undefined) {
                return;
            }

            //Retorna mensagem proveninete do servidor
            let responseText = resp.success[Object.keys(resp.success)[0]];

            //Mostrar resposta
            let toast = this.toastCtrl.create({
                message: responseText,
                duration: 3000,
                position: "bottom"
            });

            //Emite um evento para ser capturado pelo componente pai
            this.user.getUserData().then((resp:boolean) => {
                if(!resp) return;

                //Recarrega dados de usuário
                this.loadUserData(this.user._user);
            })

            toast.present();

        });
    }

    //Seleciona uma novo componente a exibir emitindo evento 
    loadView($view: any) {
        //Emite um evento para ser capturado pelo componente pai
        this.changeViewEvent.emit($view.component);
    }

    //Favoritar Usuário
    favoriteUser($user_ID: number, event) {

        event.preventDefault();

        this.api.get('favorite/' + $user_ID).subscribe((resp: any) => {

            if (resp.success != undefined) {
                let el = event.target.parentNode;
                if (el.classList.contains("active")) {
                    el.classList.remove("active");
                    el.classList.add("inactive");
                    this.favorite = false;
                } else {
                    el.classList.add("active")
                    el.classList.remove("inactive");
                    this.favorite = true;
                }
            }

        });
    }

}