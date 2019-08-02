import { VisibilityList } from './../../../providers/visibility/visibility';
import { Component } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';
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
        visibility: <number>0
    }

    public loginErrorString;

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        visibilityList: VisibilityList) {

        this.translateService.setDefaultLang('pt-br');

        //Carrega opções de visibilidade
        visibilityList.load().then((resp) => {
            this.visibility = visibilityList.table;
        })

    }

    //Função que inicializa
    ngOnInit() {
        //Retorna dados de usuário
        this.user.getUserData().then((resp:boolean) => {

            if(!resp) return;

            //Adicionando valores a classe user
            let atributes = this.user._user;

            //Intera sobre objeto e atribui valor aos modelos de metadata
            if(atributes.metadata['my-videos'])
                this.videos = atributes.metadata['my-videos']; 

        }); 
    }

    /** Função para definir visibilidade selecionada automaticamente */
    defaultOptionSelected(var1, var2) {
        return this.visibility == undefined ? var1.value === var2.value : var1 === var2;
    }

    /** Adicionar um novo item para multiplos campos */
    addMore($parentModel: string, $event, $labels: any = '') {

        $event.preventDefault();

        //Se valor for nulo, recondicionar para array
        if (this[$parentModel].value == null) {
            this[$parentModel].value = [];
        }

        //Atribui novo item ao array
        this[$parentModel].value.push($labels);

    }

    remove($itemToDelete: string, $index: number) {

        //Se valor for nulo, recondicionar para array
        if (this[$itemToDelete].value == null) {
            return;
        }

        //Atribui novo item ao array
        this[$itemToDelete].value.splice($index);
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Campos válidos
        let saveFields: any = {
            ['my-videos']: this.videos
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

    customTrackBy(index: number, item: any): number { return index; }

}