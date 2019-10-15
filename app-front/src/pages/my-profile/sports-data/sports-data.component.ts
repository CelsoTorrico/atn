import { VisibilityList } from './../../../providers/visibility/visibility';
import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { NgForm, FormControl } from '@angular/forms';
import { SportList } from '../../../providers/sport/sport';
import { ClubList } from '../../../providers/clubs/clubs';
import { TagInputModule } from 'ngx-chips';
import { TranslateChar } from '../../../providers/useful/translateChar';


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
        visibility: <number>0
    }

    height: any = {
        value: <string>'',
        visibility: <number>0
    }

    posicao = {
        value: <string>'',
        visibility: <number>0
    }

    formacao: any = {
        value: <any>[],
        visibility: <number>0
    }

    cursos: any = {
        value: <any>[],
        visibility: <number>0
    }

    eventos: any = {
        value: <any>[],
        visibility: <number>0
    }

    club_site: any = {
        value: <string>'',
        visibility: <number>0
    }

    club_liga: any = {
        value: <any>[],
        visibility: <number>0
    }

    club_sede: any = {
        value: <string>'',
        visibility: <number>0
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

    tagInputAdd:any;

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public modal: ModalController,
        public translateService: TranslateService,
        visibilityList: VisibilityList,
        sportList: SportList,
        clubList: ClubList) {

        this.translateService.setDefaultLang('pt-br');

        //Lista de visibilidade
        visibilityList.load().then((resp) => {
            this.visibility  = visibilityList.table;
        });

        //Lista de Esportes
        sportList.load().then((resp) => {
            this.$sportTable    = sportList.table;
            this.$sportList     = sportList.list; 
        });

        //Lista de Clubes
        clubList.load().then((resp) => {
            this.$clubsTable    = clubList.table
            this.$clubsList     = clubList.list;
        });

    }

    //Função que inicializa
    ngOnInit() {
        
        //Aguarda setup de dados e atribui
        this.user.dataReady.subscribe((resp) => {
            
            if(resp.status != 'ready') return;

            //Adicionando valores a classe user
            let atributes = this.user._user;

            //Intera sobre objeto e atribui valor aos modelos de metadata
            for (var key in atributes.metadata) {
                if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
                    this[key] = atributes.metadata[key];
                }
            }

            //Atribuindo dados aos modelos
            this.type  = atributes.type.ID;
            this.sport = atributes.sport;
            this.clubes = atributes.clubs;

            //Intervalo para correta assimilação dos campos esportes e clubes
            setTimeout(function($this){
                
                //Define os clubes selecionados
                $this.savedClubsList();
                
                //Define os esportes selecionados
                $this.savedSportList();

            }, 2000, this);
            

        });

        //Realiza requisição de dados
        this.user.getUserData().then((resp: boolean) => {
            if (!resp) return;
        });
    }

    ionViewDidEnter() {
        
    }

    //Define esportes selecionados = salvos
    savedSportList() {
        //Define ID's dos esportes selecionados
        this.$sportTable.forEach(element => {
            this.setChoosed([null, element[1]], this.sport, 'sport_name', '$sportsSelected');
        });
    }

    //Define clubes selecionados = salvos
    savedClubsList() {        
        //Define ID's dos clubes selecionados
        this.$clubsTable.forEach(element => {
            //elementos do clube vem como objetos, abaixo criamos array com a propriedade
            this.setChoosed([null, element.display_name], this.clubes, 'club_name', '$clubsSelected');
        });        
    }

    //Adiciona elementos já selecionados a partir do perfil de usuário
    private setChoosed(item: any, list: any[], compare: string, selected: string) {

        //Se lista for nula
        if (list == null || list == undefined) return;

        //Intera sobre items
        for (const element of list) {
            //Compara valores selecionados com tabela de esportes
            if (element[compare] == item[1]) {
                //Atribui valor a array
                this[selected].push({display: element[compare]});
                break;
            }
        }

    }

    /** Compara esportes selecionados: array $sportTable */
    protected setChooseSports($sportChoose) {
        //Intera sobre items
        for (const element of this.$sportTable) {
            //Compara valores selecionados com tabela de esportes
            if (element[1] == $sportChoose.display) {
                //Atribui valor a array
                this.sport.push(element[0]);
            }
        }
    }

    /** Compara clubes selecionados: object $clubsTable */
    private setChooseClubs($clubsChoose) {
        //Intera sobre items
        for (const element of this.$clubsTable) {
            //Compara valores selecionados com tabela de esportes
            if (element.display_name == $clubsChoose.display) {
                //Atribui valor a array
                this.clubes.push(element.ID);
            }
        }

    }

    /** Função para definir visibilidade selecionada automaticamente */
    defaultOptionSelected(var1, var2) {
        return this.height.visibility == undefined ? var1.value === var2.value : var1 === var2;
    }

    /** Adicionar um novo item para multiplos campos */
    addMore($parentModel: string, $event, $labels: any = [null, null, null]) {

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
        let saveFields: any = {
            sport: {},
            clubes: {},
            weight: {},
            height: {},
            posicao: {},
            formacao: {},
            cursos: {},
            conquistas: {
                value: <any>[],
                visibility: <number>null
            },
            eventos: {
                value: <any>[],
                visibility: <number>null
            },
            club_site: {
                value: <string>'',
                visibility: <number>null
            },
            club_liga: {
                value: <any>[],
                visibility: <number>null
            },
            club_sede: {
                value: <string>'',
                visibility: <number>null
            }
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

    /** 
     * Implementa a seleção de esportes. Inserir valores sem acentuação correta é considerado 
     * @since  2.1
     * */
    tagInputChange(value, target) {

        //Para esportes cadastrados
        if(value == target.display) {
            return true;
        }

        let sport = target.display;
        for (const i in target.display) {

            //Caracteres
            let currentChar = target.display.charAt(i);
            let changed = TranslateChar.change(currentChar);

            //Se não foi encotrado caracter para para substituição
            if (!changed) continue;

            //Substitui ocorrências do caracter na string
            sport = target.display.replace(currentChar, changed);
        }

        //Procura pelo valor na string de esporte
        let regex = new RegExp(value, 'igm');
        let found = sport.match(regex);
    
        if(found) {
            return target.display; 
        }

        return false;
        
    }

    //Fechar modal
    dismiss($data: any = null) {
        this.viewCtrl.dismiss($data);
    }

    customTrackBy(index: number, item: any): number { return index; }

}