import { GenderList } from './../../../providers/gender/gender';
import { SuccessStepPage } from './../success/success';
import { User } from './../../../providers/user/user';
import { Api } from './../../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { BrazilStates } from '../../../providers/useful/states';
import { TranslateService } from '@ngx-translate/core';
import { SportList } from '../../../providers/sport/sport';
import { profileTypeList } from '../../../providers/profiletypes/profiletypes';
import { TranslateChar } from '../../../providers/useful/translateChar';

/* SecondStep Class*/
@Component({
    templateUrl: "profile-type.html"
})
export class ProfileTypeStepPage {

    public $account: any = {};

    public $typeUserSelected: number = 1;

    public $sportSelected = [];

    //Lista de Esportes
    protected $sportTable: any;
    protected $sportList = [];

    //Lista de tipos de usuário
    protected $typeUserList:any;

    //Lista de generos
    protected $genderList:any;

    //Lista de Estados
    protected $statesList = [];

    public $error = '';

    constructor(
        private navCtrl: NavController,
        private loading: LoadingController,
        private params: NavParams,
        private api: Api,
        private user: User,
        public  translateService: TranslateService,
        states: BrazilStates,
        sport:  SportList,
        gender: GenderList,
        profileType: profileTypeList) {

        this.translateService.setDefaultLang('pt-br');

        //Adicionando dados provenientes da view anterior
        this.$account =
            {
                display_name: this.params.get('display_name'),
                user_email: this.params.get('user_email'),
                user_pass: this.params.get('user_pass'),
                confirm_pass: this.params.get('confirm_pass')
            };

        //Carrega lista de estados do provider
        this.$statesList = states.statesList;

        //Carrega lista de esportes
        sport.load().then((resp) => {
            //Tabela de Esportes com ID e nome
            this.$sportTable    = sport.table; 
            this.$sportList     = sport.list;  
        })

        //Atribui tipos de usuários
        this.$typeUserList = profileType.list;

        //Atribui generos
        this.$genderList = gender.list;

    }

    //Função que inicializa
    ngOnInit() { 
        
    }

    /** Função para o botão de Login, vai a view de login*/
    goToLogin() {
        this.navCtrl.push('Login');
    }

    /** Redireciona para próxima etapa junto com as variaveis */
    submitRegister(form: NgForm) {

        //Se formulário estiver inválido, mostrar mensagem
        if (form.status == 'INVALID') {
            this.$error = 'Por favor, preencha todos campos solicitados!';
            return;
        }

        //Adiciona tipo de usuário selecionado
        this.$account.type = this.$typeUserSelected;

        //Inicializa objeto com array
        this.$account.sport = [];

        //Define ID's dos esportes selecionados
        this.$sportSelected.forEach(element => {
            this.setChooseSports(element);
        });

        //Se cadastro com sucesso, ir para página de sucesso
        this.insertRegister(this.$account);

    }

    //Insere novo usuário no banco
    private insertRegister(body: any) {

        //Inicializa loading
        let loading = this.loading.create({ content: 'Loading'});
        loading.present();

        //Envia dados ao servidor
        this.user.signup(body).then(($resp:boolean) => {

            //Fecha loading
            loading.dismiss();

            //Se cadastro realizado com sucesso direcionar para página 'sucesso'
            if ($resp) {
                this.navCtrl.push(SuccessStepPage);
            }

        }).catch((rej) => {
            //Feha loading
            loading.dismiss();
        });
    }

    /** Função que compara esportes selecionados a atribui a variavel para envio
     * 
     */
    private setChooseSports($sportChoose) {
        console.log($sportChoose);
        //Intera sobre items
        for (const element of this.$sportTable) {
            //Compara valores selecionados com tabela de esportes
            if (element[1] == $sportChoose.display) {
                //Atribui valor a array
                this.$account.sport.push(element[0]);
                break;
            }
        }
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

}