import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'videos-data',
    templateUrl: 'videos-data.html'
})
export class MyProfileVideosComponent {

    /** Modelos do Formulário */

    videos: any = {
        value: [],
        visibility: <number>null
    }

    public loginErrorString;

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
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
            $this.videos.value = (atributes.metadata['my-videos'].value)? atributes.metadata['my-videos'].value : [];

            //Lista de Visibilidades
            $this.getVisibility();
        }

    }

    //Função que inicializa
    ngOnInit() {
        //Retorna dados de usuário
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

    /** Função para definir visibilidade selecionada automaticamente */
    defaultOptionSelected(var1, var2){
        return this.visibility == undefined ? var1.value === var2.value : var1 === var2;
    }

    /** Adicionar um novo item para multiplos campos */
    addMore($parentModel:string, $event, $labels:any = '') { 

        $event.preventDefault();

        //Se valor for nulo, recondicionar para array
        if(this[$parentModel].value == null){
            this[$parentModel].value = [];
        }

        //Atribui novo item ao array
        this[$parentModel].value.push($labels);

    }

    remove($itemToDelete:string, $index:number){
        
        //Se valor for nulo, recondicionar para array
        if(this[$itemToDelete].value == null){
            return;
        }

        //Atribui novo item ao array
        this[$itemToDelete].value.splice($index);
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Campos válidos
        let saveFields:any = {
            ['my-videos']: this.videos
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

    customTrackBy(index: number, item: any): number { return index; }

}