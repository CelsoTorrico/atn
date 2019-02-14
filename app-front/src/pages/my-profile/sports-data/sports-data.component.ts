import { MultipleFields } from './../formUtils/multiple-fields';
import { MyProfilePersonalDataComponent } from './../personal-data/personal-data.component';
import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
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
        value: <string>'',
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

    public fieldToAdd:any = [ '', '', ''];

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public modal: ModalController) {

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
        this.clubes = atributes.clubs;
        this.conquistas = atributes.metadata['titulos-conquistas'];

        //Carrega lista de esporte e clubes para popular selecionadores
        this.getSportList();
        this.getClubsList();
    }

    //REtorna lista de esportes
    getSportList() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let subscriber = this.api.get('/user/sports').subscribe((resp: any) => {

            //Tabela de Esportes com ID e nome
            this.$sportTable = resp;

            //Lista de apenas nomes de esportes
            this.$sportTable.forEach(element => {
                //[0] = id, [1] = sport_name
                this.$sportList.push(element[1]);
            });

            //Define ID's dos esportes selecionados
            this.$sportTable.forEach(element => {
                this.setChoosed(element, this.sport, 'sport_name', '$sportsSelected');
            });

        }, err => {
            return;
        });

    }

    //REtorna lista de esportes
    getClubsList() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let subscriber = this.api.get('/user/clubs').subscribe((resp: any) => {

            //Tabela de Clubes com ID e nome
            this.$clubsTable = resp;

            //Lista de apenas nomes de clubes
            this.$clubsTable.forEach(element => {
                //[0] = id, [1] = display_name
                this.$clubsList.push(element.display_name);
            });

            //Define ID's dos clubes selecionados
            this.$clubsTable.forEach(element => {
                let arrayItem = ['', element.display_name];
                this.setChoosed(arrayItem, this.clubes, 'club_name', '$clubsSelected');
            });

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

    /** Adicionar um novo item para multiplos campos | Abre modal */
    addMore($parentModel, $event) {
        
        $event.preventDefault();

        //Abre modal
        let addMore = this.modal.create(MultipleFields, { list: ['INSTITUTE','COURSE','YEAR']});

        //Ao modal ser fechado, é passada os dados modificados nele
        addMore.onDidDismiss(data => {
            $parentModel.value.push(data);
        });

        //Cria o modal
        addMore.present();
        
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        console.log(form);
        console.log($event);

        //Validação de dados
        /*//let email = form.getControl(this.user_email);

        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in saveFields) {
            if (this.hasOwnProperty(key) && this[key] != undefined) {
                saveFields[key] = this[key];
            }
        }

        //Realiza update de dados do usuario
        let resp = this.user.update(saveFields);*/

    }

    customTrackBy(index: number, item:any): number { return index; }

}