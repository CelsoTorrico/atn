import { Observable } from 'rxjs/Observable';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Api, User } from '../../../providers';

@Component({
    selector: 'profile-resume',
    templateUrl: "profile-resume.html",
})
export class ProfileResumeComponent implements OnInit{

    @Output() changeViewEvent = new EventEmitter<any>();

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

    constructor(public navCtrl: NavController, private user: User, private api: Api) {

        // used for an example of ngFor and navigation
        this.views = 
        [{ title: 'Profile', component: 'personalView' },
        { title: 'Stats', component: 'statsView' }]; 

    }

    ngOnInit() {
        this.fillUserData();
    }

    //Adiciona valores as variaveis globais
    fillUserData() {

        //Retorna dados pessoais
        this.user._userObservable.subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Adicionando valores as variavel global
            let atributes = resp;

            //Atribuindo dados aos modelos
            this.ID = atributes.ID;
            this.display_name = atributes.display_name;
            this.type = atributes.type.ID;
            this.sport = atributes.sport;

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

        }, err => {
            return;
        });
    }

    //Abre Modal e envia dados do usuário atual
    loadView($view: any) {
        //Emite um evento para ser capturado pelo pais
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