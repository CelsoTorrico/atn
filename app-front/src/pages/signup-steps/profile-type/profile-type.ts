import { User } from './../../../providers/user/user';
import { Api } from './../../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../login/login';
import { NgForm } from '@angular/forms';
import { BrazilStates } from '../../../providers/useful/states';
import { TranslateService } from '@ngx-translate/core';


/* SecondStep Class*/
@IonicPage({
    name: 'ProfileType',
    segment: 'profile-type'
})
@Component({
    templateUrl: "profile-type.html"
})

export class ProfileType{ 

    public $account:any = {
        gender: 'male'
    };

    public $typeUserSelected:number = 1;    
    
    public $sportSelected = [];    

    //Lista de Esportes
    protected $sportTable:any;
    protected $sportList = [];

    //Lista de tipos de usuário
    protected $typeUserList = [
        {valor: 1,  texto: 'Atleta'}, 
        {valor: 2,  texto: 'Profissional do Esporte'},
        {valor: 3,  texto: 'Faculdade'},
        {valor: 4,  texto: 'Clube Esportivo'},
        {valor: 5,  texto: 'Confederação'} 
    ];

    //Lista de generos
    protected $genderList = [
        {valor: 'male',     texto: 'Masculino'}, 
        {valor: 'female',   texto: 'Feminino'}
    ];

    //Lista de Estados
    protected $statesList = [];

    public $error = ''; 

    constructor(
        private navCtrl: NavController, 
        private params: NavParams, 
        private api: Api, 
        private user: User, 
        public states:BrazilStates,
        public translateService: TranslateService) { 
    
            this.translateService.setDefaultLang('pt-br');
        
        //Adicionando dados provenientes da view anterior
        this.$account = 
            {
                display_name:   this.params.get('display_name'), 
                user_email:     this.params.get('user_email'), 
                user_pass:      this.params.get('user_pass'),
                confirm_pass:   this.params.get('confirm_pass')
            };

        //Carrega lista de estados do provider
        this.$statesList = this.states.statesList;    

    }

    //Função que inicializa
    ngOnInit() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.get('/user/sports').subscribe((resp:any) => { 

            //Tabela de Esportes com ID e nome
            this.$sportTable = resp;

            //Lista de apenas nomes de esportes
            resp.forEach(element => {
                //[0] = id, [1] = sport_name
                this.$sportList.push(element[1]);
            });

        }, err => { 
            return; 
        });
    }

    onBlur(){
        
    }

    /** Função para o botão de Login, vai a view de login*/
    goToLogin(){
        this.navCtrl.push(LoginPage);
    }
    
    /** Redireciona para próxima etapa junto com as variaveis */
    submitRegister(form: NgForm){ 
        
        //Se formulário estiver inválido, mostrar mensagem
        if (form.status == 'INVALID') {
            this.$error = 'Por favor, preencha todos campos solicitados!'; 
            return;
        }
        
        //Adiciona tipo de usuário selecionado
        this.$account.type  = this.$typeUserSelected;

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
    private insertRegister(body:any){    
        
        //Injetando navControler
        this.user.injectNavCtrl(this.navCtrl);

        //executa função de registrar
        this.user.signup(body);
    }

    private setChooseSports($sportChoose:string) {
        //Intera sobre items
        this.$sportTable.forEach(element => {
            //Compara valores selecionados com tabela de esportes
            if (element[1] == $sportChoose) {
                //Atribui valor a array
                this.$account.sport.push(element[0]);
            }
        });
    }

}