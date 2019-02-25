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

    public loginErrorString;

    public statsFields: any[] = [];

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public translateService: TranslateService) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Função a ser executada após requisição de dados de usuário
        this.addFormData = function ($this:any) {

            //Adicionando valores a classe user
            let atributes = $this.user._user;

            //Intera sobre objeto e atribui valor aos modelos de metadata
            for (var key in atributes.metadata) {
                if (atributes.metadata.hasOwnProperty(key) && $this[key] != undefined) {
                    $this[key] = atributes.metadata[key];
                }
            }

            //Atribuindo dados aos modelos
            $this.type = atributes.type.ID;

            //Lista de Visibilidades
            $this.getVisibility();
        }
    }

    //Função que inicializa
    ngOnInit() {
        this.user.subscribeUser(this.addFormData, this);
    }

    getVisibility(){
        //Retorna opções de visibilidade
        this.user._visibilityObservable.subscribe((resp:any) => {
            if(Object.keys(resp).length > 0){
                this.visibility = resp;
            }
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
        let resp = this.user.update(saveFields);

        if(resp){
            this.dismiss();
        }

    }

    //Fechar modal
    dismiss() {
        this.viewCtrl.dismiss();
    }

    customTrackBy(index: number, item: any): number {
        return index;
    }

}