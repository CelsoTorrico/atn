import { VisibilityList } from './../../../providers/visibility/visibility';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
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
        visibility: <number>0
    }

    public loginErrorString;

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public statsList: StatsList,
        public translateService: TranslateService,
        visibilityList: VisibilityList) { 
    
        this.translateService.setDefaultLang('pt-br');

        //carrega traduções
        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        });

        //Carrega visibilidades
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

            //Atribuir data de usuário ao modelo
            this.titulos_conquistas = atributes.metadata['titulos-conquistas'];

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