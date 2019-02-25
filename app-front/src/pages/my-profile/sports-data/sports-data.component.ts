import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'sports-data',
    templateUrl: 'sports-data.html'
})
export class MyProfileSportsComponent {

    /** Modelos do Formulário */
    type: number;

    sport: any[] = [];

    clubes: any[] = [];

    weight: any = {
        value: <string>'',
        visibility: <number>null
    }

    height: any = {
        value: <string>'',
        visibility: <number>null
    }

    posicao = {
        value: [<string>''],
        visibility: <number>null
    }

    formacao: any = {
        value: <any>[],
        visibility: <number>null
    }

    cursos: any = {
        value: <any>[],
        visibility: <number>null
    }

    conquistas: any = {
        value: <any>[],
        visibility: <number>null
    }

    eventos: any = {
        value: <any>[],
        visibility: <number>null
    }

    club_site: any = {
        value: <string>'',
        visibility: <number>null
    }

    club_liga: any = {
        value: <any>[],
        visibility: <number>null
    }

    club_sede: any = {
        value: <string>'',
        visibility: <number>null
    }

    //Lista de Esportes
    public $sportsSelected = [];
    protected $sportTable = [];
    protected $sportList = [];

    //Lista de Clubes
    public $clubsSelected = [];
    protected $clubsTable = [];
    protected $clubsList = [];

    public loginErrorString;

    public addFormData: any;

    public visibility: any;

    public fieldToAdd: any = [null, null, null];

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        public modal: ModalController) {

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
            $this.sport = atributes.sport;
            $this.clubes = atributes.clubs;

            //Carrega lista de esporte e clubes para popular selecionadores
            $this.getSportList();
            $this.getClubsList();
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

    //REtorna lista de esportes
    getSportList() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let subscriber = this.api.get('/user/sports').subscribe((resp: any) => {

            if(resp.length <= 0){
                return;
            }

            //Tabela de Esportes com ID e nome
            this.$sportTable = resp;

            //Lista de apenas nomes de esportes
            this.$sportTable.forEach(element => {
                //[0] = id, [1] = sport_name
                this.$sportList.push(element[1]);
            });

            if(this.sport != undefined){
                 //Define ID's dos esportes selecionados
                this.$sportTable.forEach(element => {
                    this.setChoosed(element, this.sport, 'sport_name', '$sportsSelected');
                });
            }           

        }, err => {
            return;
        });

    }

    //REtorna lista de esportes
    getClubsList() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let subscriber = this.api.get('/user/clubs').subscribe((resp: any) => {

            if(resp.length <= 0){
                return;
            }

            //Tabela de Clubes com ID e nome
            this.$clubsTable = resp;

            //Lista de apenas nomes de clubes
            this.$clubsTable.forEach(element => {
                //[0] = id, [1] = display_name
                this.$clubsList.push(element.display_name);
            });

            if(this.clubes != undefined){
                //Define ID's dos clubes selecionados
                this.$clubsTable.forEach(element => {
                    let arrayItem = ['', element.display_name];
                    this.setChoosed(arrayItem, this.clubes, 'club_name', '$clubsSelected');
                });
            }

        }, err => {
            return;
        });

    }

    //Adiciona elementos já selecionados a partir do perfil de usuário
    private setChoosed(item: any, list: any[], compare: string, selected: string) {

        //Intera sobre items
        list.forEach(element => {
            //Compara valores selecionados com tabela de esportes
            if (element[compare] == item[1]) {
                //Atribui valor a array
                this[selected].push(element[compare]);
            }
        });
    }

    private setChooseSports($sportChoose:string) {
        //Intera sobre items
        this.$sportTable.forEach(element => {
            //Compara valores selecionados com tabela de esportes
            if (element[1] == $sportChoose) {
                //Atribui valor a array
                this.sport.push(element[0]);
            }
        });
    }

    private setChooseClubs($clubsChoose:string) {
        //Intera sobre items
        this.$clubsTable.forEach(element => {
            //Compara valores selecionados com tabela de esportes
            if (element[1] == $clubsChoose) {
                //Atribui valor a array
                this.clubes.push(element[0]);
            }
        });
    }

    /** Função para definir visibilidade selecionada automaticamente */
    defaultOptionSelected(var1, var2){
        return this.height.visibility == undefined ? var1.value === var2.value : var1 === var2;
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

        //Define ID's dos esportes selecionados
        this.sport = [];
        this.$sportsSelected.forEach(element => {
            this.setChooseSports(element); 
        });
        this.clubes = [];
        //Define ID's dos clubes selecionados
        this.$clubsSelected.forEach(element => {
            this.setChooseClubs(element); 
        });

        //Campos válidos
        let saveFields:any = {
            sport: {},
            clubes: {},
            weight: {},
            height: {},
            posicao: {},
            formacao: {},
            cursos: {}
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

    customTrackBy(index: number, item: any): number { return index; }

}