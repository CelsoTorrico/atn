import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';


@Component({
    selector: 'stats-data',
    templateUrl: 'stats-data.html'
})
export class MyProfileStatsComponent {

    type: number = null;

    sport: any[] = [];

    jogos: any = {
        value: <string>'',
        visibility: <number>null
    }

    vitorias: any = {
        value: <string>'',
        visibility: <number>null
    }

    derrotas: any = {
        value: <string>'',
        visibility: <number>null
    }

    empates: any = {
        value: <string>'',
        visibility: <number>null
    }

    titulos: any = {
        value: <string>'',
        visibility: <number>null
    }

    titulos_conquistas: any = {
        value: <string>'',
        visibility: <number>null
    }

    stats: any = {
        value: <any>[],
        visibility: <number>null
    }

    stats_sports: any = {
        value: <any>[],
        visibility: <number>null
    }

    public loginErrorString;

    public statsFields:any[] = [];

    private static $getProfile: string = 'user/self';

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public statsList: StatsList) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }

    //Função que inicializa
    ngOnInit() {

        //Adicionando valores a classe user
        let atributes = this.user._user;

        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in atributes.metadata) {
            if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
                this[key] = atributes.metadata[key];
            }
        }

        //Atribuindo dados aos modelos
        this.type = atributes.type.ID;
        this.sport = atributes.sport;
        this.titulos_conquistas = atributes.metadata['titulos-conquistas'];

        //Adicionando campos de acordo com os esportes definidos
        this.sport.forEach(element => {

            //retorna esporte atual
            let sport = element.sport_name;

            //Faz a modificação de cada letra para padrão usado
            for (var i = 0; i < element.sport_name; i++) {
                let currentChar = element.sport_name.charAt(i);
                let changed = this.subsChar(currentChar);
                sport.replace(currentChar, changed);
            }   
            
            //Nome do esporte reformatado
            let sport_name = sport.toLowerCase();
            
            //Adiciona ao array de objetos
            this.statsFields.push({ 
                [sport_name] : this.statsList.statsList[sport_name]
            });

            console.log(this.statsFields); 

        });
    }

    private subsChar(c) {

        let chars = {
            'Š':  'S', 'š':  's', 'Ž':  'Z', 'ž':  'z', 'À':  'A', 'Á':  'A', 'Â':  'A', 'Ã':  'A', 'Ä':  'A', 'Å':  'A', 'Æ':  'A', 'Ç':  'C', 'È':  'E', 'É':  'E',
            'Ê':  'E', 'Ë':  'E', 'Ì':  'I', 'Í':  'I', 'Î':  'I', 'Ï':  'I', 'Ñ':  'N', 'Ò':  'O', 'Ó':  'O', 'Ô':  'O', 'Õ':  'O', 'Ö':  'O', 'Ø':  'O', 'Ù':  'U',
            'Ú':  'U', 'Û':  'U', 'Ü':  'U', 'Ý':  'Y', 'Þ':  'B', 'ß':  'Ss', 'à':  'a', 'á':  'a', 'â':  'a', 'ã':  'a', 'ä':  'a', 'å':  'a', 'æ':  'a', 'ç':  'c',
            'è':  'e', 'é':  'e', 'ê':  'e', 'ë':  'e', 'ì':  'i', 'í':  'i', 'î':  'i', 'ï':  'i', 'ð':  'o', 'ñ':  'n', 'ò':  'o', 'ó':  'o', 'ô':  'o', 'õ':  'o',
            'ö':  'o', 'ø':  'o', 'ù':  'u', 'ú':  'u', 'û':  'u', 'ý':  'y', 'þ':  'b', 'ÿ':  'y',
            ' ' :  '-'
        };

        return chars[c];
    }

    customTrackBy(index: number, item:any): number { 
        console.log(item);
        return index; 
    }

}