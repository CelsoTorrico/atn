import { Observable } from 'rxjs/Observable';
import { Component, Input, SimpleChanges } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User, Api } from '../../../providers';
import { BrazilStates } from '../../../providers/useful/states';
import { FormControl, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'personal-data-edit',
    templateUrl: 'personal-data.html',

})
export class MyProfilePersonalDataComponent {

    ID: number

    display_name: string

    user_email: string;

    type: number = 1;

    telefone: any = {
        value: <string>'',
        visibility: <number>0
    }

    biography: any = {
        value: <string>'',
        visibility: <number>0
    }

    birthdate: any = {
        value: <string>'',
        visibility: <number>0
    }

    rg: any = {
        value: <string>'',
        visibility: <number>0
    }

    cpf: any = {
        value: <string>'',
        visibility: <number>0
    }

    cnpj: any = {
        value: <string>'',
        visibility: <number>0
    }

    gender: any = {
        value: <string>'',
        visibility: <number>0
    }

    profile_img: any = {
        value: <string>'',
        visibility: <number>0
    }

    address: any = {
        value: <string>'',
        visibility: <number>0
    }

    neighbornhood: any = {
        value: <string>'',
        visibility: <number>0
    }

    city: any = {
        value: <string>'',
        visibility: <number>0
    }

    state: any = {
        value: <string>'',
        visibility: <number>0
    }

    country: any = {
        value: <string>'',
        visibility: <number>0
    }

    zipcode: any = {
        value: <string>'',
        visibility: <number>0
    }

    //Função para ser exucutada após requisição de dados
    public addFormData: any;

    //Lista de opções de Visibilidade
    public visibility: any[];

    //Lista de Estados
    protected $statesList = [];

    //Url de requisição de usuário
    private static readonly $getProfile: string = 'user/self';

    public loginErrorString;

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public states: BrazilStates,
        public translateService: TranslateService) { 
    
            this.translateService.setDefaultLang('pt-br');

        //Carrega lista de estados do provider
        this.$statesList = this.states.statesList;

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
            $this.display_name = atributes.display_name;
            $this.user_email = atributes.user_email;
            $this.type = atributes.type.ID;
        }
    }

    //Função que inicializa
    ngOnInit() {
        //Atribui dados do usuário
        this.user.subscribeUser(this.addFormData, this);
        //Retorna seleção de visibilidade
        this.user._visibilityObservable.subscribe((resp:any) => {
            if(Object.keys(resp).length > 0){
                this.visibility = resp;
            }
        });
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Campos válidos
        let saveFields:any = {
            display_name: '',
            user_email: '',
            telefone: {
                value: <string>'',
                visibility: <number>0
            },
            biography: {
                value: <string>'',
                visibility: <number>0
            },
            birthdate: {
                value: <string>'',
                visibility: <number>0
            },
            rg: {
                value: <string>'',
                visibility: <number>0
            },
            cpf: {
                value: <string>'',
                visibility: <number>0
            },
            cnpj: {
                value: <string>'',
                visibility: <number>0
            },
            gender: {
                value: <string>'',
                visibility: <number>0
            },
            address: {
                value: <string>'',
                visibility: <number>0
            },
            neighbornhood: {
                value: <string>'',
                visibility: <number>0
            },
            city: {
                value: <string>'',
                visibility: <number>0
            },
            state: {
                value: <string>'',
                visibility: <number>0
            },
            country: {
                value: <string>'',
                visibility: <number>0
            },
            zipcode: {
                value: <string>'',
                visibility: <number>0
            }
        };

        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in saveFields) {
            if (this.hasOwnProperty(key)) {
                saveFields[key] = this[key]; 
            }
        }

        //Realiza update de dados do usuario
        let updateObservable = this.user.update(saveFields);

        updateObservable.subscribe((resp: any) => {
            
            // Se mensagem contiver parametro 'success'
            if (Object.keys(resp).length <= 0) {
                return; 
            }

            //Fechar modal e retornar data
            this.dismiss(resp);
           
          }, err => {
            console.error('ERROR', err);
          });

    }

    //Fechar modal
    dismiss($data:any = null){
        this.viewCtrl.dismiss($data);
    }

}
