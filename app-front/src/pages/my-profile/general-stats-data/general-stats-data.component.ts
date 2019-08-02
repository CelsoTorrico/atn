import { VisibilityList } from './../../../providers/visibility/visibility';
import { Component } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'general-stats-data',
    templateUrl: 'general-stats-data.html' 
})
export class MyProfileGeneralStatsComponent {

    type: number = null;

    jogos: any = {
        value: <string>'',
        visibility: <number>0
    }

    vitorias: any = {
        value: <string>'',
        visibility: <number>0
    }

    derrotas: any = {
        value: <string>'',
        visibility: <number>0
    }

    empates: any = {
        value: <string>'',
        visibility: <number>0
    }

    titulos: any = {
        value: <string>'',
        visibility: <number>0
    }

    public loginErrorString;

    public statsFields: any[] = [];

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        visibilityList: VisibilityList) { 
    
        this.translateService.setDefaultLang('pt-br');

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Carrega campos de visibilidade
        visibilityList.load().then(() => {
            this.visibility = visibilityList.table
        });

    }

    //Função que inicializa
    ngOnInit() {
        //Retorna dados de usuário
        this.user.getUserData().then((resp:boolean) => {
            
            if(!resp) return;
            
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

        });
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Campos válidos
        let saveFields:any = {
            jogos: null,
            vitorias: null,
            derrotas: null, 
            empates: null,        
            titulos: null 
        }

        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in saveFields) {
            if (this.hasOwnProperty(key) && this[key] != undefined) {
                saveFields[key] = this[key];
            }
        }

        //Realiza update de dados do usuario
        let respObservable = this.user.update(saveFields);
        respObservable.subscribe((resp: any) => {

            // Se mensagem contiver parametro 'success'
            if (Object.keys(resp).length <= 0) {
                return;
            }

            //Fechar modal e retornar data
            this.dismiss(resp);
        });

    }

    //Fechar modal
    dismiss(data:any = null) {
        this.viewCtrl.dismiss(data);
    }

    customTrackBy(index: number, item: any): number {
        return index;
    }

}