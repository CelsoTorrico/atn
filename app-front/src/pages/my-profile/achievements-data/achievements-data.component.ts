import { Component } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'achievements-data',
    templateUrl: 'achievements-data.html'
})
export class MyProfileAchievementsComponent {

    titulos_conquistas: any = {
        value: [],
        visibility: <number>null
    }

    public loginErrorString;

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        public statsList: StatsList) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })

        //Função a ser executada após requisição de dados de usuário
        this.addFormData = function ($this: any) {

            //Adicionando valores a classe user
            let atributes = $this.user._user;

            //Atribuir data de usuário ao modelo
            $this.titulos_conquistas = atributes.metadata['titulos-conquistas'];

            //Carrega lista de visibilidades
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

    /** Adicionar um novo item para multiplos campos */
    addMore($parentModel:string, $event, $labels:any = [null,null,null]) { 

        $event.preventDefault();

        //Se valor for nulo, recondicionar para array
        if(this[$parentModel].value == null){
            this[$parentModel].value = [];
        }

        //Atribui novo item ao array
        this[$parentModel].value.push($labels);

    }

    /** Remover um item */
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
            ['titulos-conquistas'] : this.titulos_conquistas
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