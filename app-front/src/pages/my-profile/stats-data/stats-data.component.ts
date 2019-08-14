import { TranslateChar } from './../../../providers/useful/translateChar';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { NgForm, FormGroup } from '@angular/forms';
import { VisibilityList } from '../../../providers/visibility/visibility';


@Component({
    selector: 'stats-data',
    templateUrl: 'stats-data.html'
})
export class MyProfileStatsComponent {

    public groupStats: FormGroup;

    type: number = null;

    sport: any[] = [];

    stats: any = {
        value: <any>[],
        visibility: <number>0
    }

    public statsLoaded: boolean = false;

    public loginErrorString;

    public addFormData: any;

    public statsFields: any = [];

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public statsList: StatsList,
        public translateService: TranslateService,
        visibilityList:VisibilityList) {

        this.translateService.setDefaultLang('pt-br');

        visibilityList.load().then(() => {
            this.visibility = visibilityList.table
        });

    }

    ionViewDidLoad() {
        //Retorna dados de usuário
        this.user.getUserData().then((resp:boolean) => {

            if(!resp) return;

            //Adicionando valores a classe user
            let atributes = this.user._user;

            //Atribuindo dados aos modelos
            this.type = atributes.type.ID;
            this.sport = atributes.sport;

            //Adicionando campos de acordo com os esportes definidos
            this.sport.forEach(element => {

                //retorna esporte atual
                let sport = element.sport_name;

                //Faz a modificação de cada letra para padrão usado
                for (const i in element.sport_name) {

                    //Caracteres
                    let currentChar = element.sport_name.charAt(i);
                    let changed = this.subsChar(currentChar);

                    //Se encontrado algum caractere para substituição
                    if (changed != undefined) {
                        sport = element.sport_name.replace(currentChar, changed);
                    }
                }

                //Nome do esporte reformatado
                let sport_name = sport.toLowerCase();

                //Key para atribuir propriedades
                let key = sport_name.replace(/ /g, '-');

                this.statsFields.push(key);

            });

            //Preenche modelo com campos e valores já preenchidos
            this.stats.value.push(this.compareAndFill());

            //Atribui visibilidade definida
            this.stats.visibility = atributes.metadata.stats.visibility;

            this.statsLoaded = true;

        });
    }

    //Função que inicializa
    ngOnInit() {
        this.statsLoaded = true;
    }

    getVisibility() {
        //Retorna opções de visibilidade
        this.user._visibilityObservable.subscribe((resp: any) => {
            if (Object.keys(resp).length > 0) {
                this.visibility = resp;
            }
        });
    }

    defineTypeInput($name: string) {

        //Verificar se tipo de campo deve ser
        let string = $name.search(/(Evento|Especialidade|Resultado|Oponente|Grupo|Time)/); //text
        let date = $name.search(/Data/); //date

        //se encontrou string retorna tipo
        if (string >= 0) {
            return 'text';
        }
        //retorna tipo data
        if (date >= 0) {
            return 'date'
        }

        return 'number';
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

        //Campos válidos
        let saveFields: any = {
            stats: this.stats
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
    dismiss(data: any = null) {
        this.viewCtrl.dismiss(data);
    }

    //Função para preencher o modelo de estatísticas com datas provenientes do BD
    compareAndFill() {

        this.statsFields.forEach(function (element, index, array) {

            //Adiciona ao array de objetos
            this.stats.value.push({ [element]: this.statsList.getSportProperty(element) });

            //Percorre atributos do atleta e preenche os campos já anteriormente já preenchidos
            let sportCategory = this.user._user.metadata.stats.value[element]

            //percorre objetos e atribui valor
            for (const key in sportCategory) {
                for (const p in sportCategory[key]) {
                    let data = sportCategory[key][p];
                    if (data == '') { return }
                    this.stats.value[index][element][key][p] = data;
                }
            }

        }, this);

    }

    private subsChar(c) {

        let chars = {
            'Š': 'S', 'š': 's', 'Ž': 'Z', 'ž': 'z', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'A', 'Ç': 'C', 'È': 'E', 'É': 'E',
            'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ù': 'U',
            'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ý': 'Y', 'Þ': 'B', 'ß': 'Ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'a', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'o', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o',
            'ö': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ý': 'y', 'þ': 'b', 'ÿ': 'y', ' ': '-'
        };

        return chars[c];
    }

    customTrackBy(index: number, item: any): number {

        return index;
    }

}