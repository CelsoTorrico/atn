import { Observable } from 'rxjs/Observable';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
    selector: 'profile-resume',
    templateUrl: "profile-resume.html",
})
export class ProfileResumeComponent {

    @Input() userData: Observable<ArrayBuffer>;

    ID: number = null;

    display_name: string = '';

    type: number = null;

    favorite:boolean = false;

    profile_img: any = { value: '' };

    birthdate: any = { value: '' };

    sport: any = { value: '' };

    clubes: any = { value: '' };

    height: any = { value: '' };

    weight: any = { value: '' };

    jogos: any = { value: '' };

    vitorias: any = { value: '' };

    derrotas: any = { value: '' };

    empates: any = { value: '' };

    titulos: any = { value: '' };

    ['titulos-conquistas']: any = { value: '' };

    constructor(public navCtrl: NavController, private api: Api) { }

    ngOnInit() {
        this.fillUserData();
    }

    //Adiciona valores as variaveis globais
    fillUserData() {

        this.userData.subscribe((resp: any) => {

            if (resp.length < 0) {
                return;
            }

            if (resp.metadata != undefined) {
                //Intera sobre objeto e atribui valor aos modelos de metadata
                for (var key in resp.metadata) {
                    if (resp.metadata.hasOwnProperty(key) && this[key] != undefined) {
                        this[key] = resp.metadata[key];
                    }
                }
            }

            //Atribuindo dados aos modelos
            this.ID = resp.ID;
            this.display_name = resp.display_name;
            this.type = resp.type.ID;

        });

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