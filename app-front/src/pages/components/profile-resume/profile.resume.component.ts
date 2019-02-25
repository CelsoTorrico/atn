import { Observable } from 'rxjs/Observable';
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Api, User } from '../../../providers';
import { ChartComponent } from 'angular2-chartjs';

@Component({
    selector: 'profile-resume',
    templateUrl: "profile-resume.html", 
})
export class ProfileResumeComponent implements OnInit{

    @Input() user:User;

    @Input() isLogged:boolean;

    @Output() changeViewEvent = new EventEmitter<any>();

    @ViewChild(ChartComponent) chart: ChartComponent;

    ID: number = null;

    type: number = null;

    display_name: string = null;

    profile_img:string = null;

    favorite: boolean = false;

    birthdate:string = null;

    sport: any = { value: null };

    height:number = null;

    weight:number = null;

    jogos:number = null;

    aproveitamento: any = {
        value: null
    }

    public views: any[] = null;

    /** Upload de Photo */
    uploadPhoto:any;

    //Chart - Estatistica
    // Pie
    typeChart = 'doughnut';
    data = {
        labels: ["Vitórias", "Empates", "Derrotas"],
        datasets: [
            {
            label: "",
            data: [0,0,0]
            }
        ]
    };
    options = {
        legend:{
            display: false
        },
        responsive: true,
        maintainAspectRatio: false
    };

    constructor(
        public navCtrl: NavController, 
        private api: Api) {

        // used for an example of ngFor and navigation
        this.views = 
        [{ title: 'Profile', component: 'personalView' },
        { title: 'Stats', component: 'statsView' }]; 

    }

    ngOnInit() {
        this.fillUserData();
    }

    changePhoto($event) {

        if ($event.target.files[0] == undefined) {            
            return false;
        }
        
        //Convertendo data em objeto FormData
        let formData = new FormData();        

        //O campo de imagem deve permanecer na ordem
        let file = $event.target.files[0];
        formData.append('profile_img', file, file.name);

        //Para envio de imagens {{ options }}
        let response = this.user.update(formData, true);        
    }

    //Adiciona valores as variaveis globais
    fillUserData() {

        //Retorna dados pessoais
        this.user._userObservable.subscribe((resp: any) => {

            //Se não existir items a exibir
            if (Object.keys(resp).length <= 0) { 
                return;
            }

            //Adicionando valores as variavel global
            let atributes = resp;

            //Atribuindo dados aos modelos
            this.ID = atributes.ID;
            this.display_name = atributes.display_name;
            this.type = atributes.type.ID;
            this.sport = atributes.sport;
            this.favorite = atributes.favorite;

            if(atributes.metadata.hasOwnProperty('profile_img')){
                this.profile_img = atributes.metadata.profile_img.value;
            } 

            if(atributes.metadata.hasOwnProperty('height')){
                this.height = atributes.metadata.height.value;
            }               

            if(atributes.metadata.hasOwnProperty('weight')){
                this.weight = atributes.metadata.weight.value;
            }                
            
            if(atributes.metadata.hasOwnProperty('birthdate')){
                this.birthdate = atributes.metadata.birthdate.value; 
            }
                

            //Pega os dados de estatística 
            this.getStats();  

        }, err => {
            return;
        });

    }

    private getStats(){
        
        //Retorna dados de estatística
        this.user._statsObservable.subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
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

    //Abrir página
    goToPage($page) {

    }

}