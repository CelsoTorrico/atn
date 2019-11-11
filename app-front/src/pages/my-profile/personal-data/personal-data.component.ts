import { ZipcodeService } from './../../../providers/zipcode/zipcode';
import { Component } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User, Api } from '../../../providers';
import { BrazilStates } from '../../../providers/useful/states';
import { NgForm } from '@angular/forms';
import { VisibilityList } from '../../../providers/visibility/visibility';
import { CareerList } from '../../../providers/career/career';
import { GenderList } from '../../../providers/gender/gender';

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

    career: any = {
        value: <string>'',
        visibility: <number>0
    }

    other_career:string;

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
    protected $genderList:any[];

    //Lista de Estados
    protected $statesList:any[];

    //Lista de carreiros
    protected $careerList:any[];

    //Url de requisição de usuário
    private static readonly $getProfile: string = 'user/self';

    //String de erro
    public loginErrorString;

    constructor(
        public navCtrl: NavController,
        public user: User,
        public api: Api,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        public zipcodeService: ZipcodeService,
        genderList: GenderList,
        statesList: BrazilStates,
        careerList: CareerList,
        visibilityList: VisibilityList) {

        this.translateService.setDefaultLang('pt-br');

        //Carrega lista de gêneros de usuários
        this.$genderList = genderList.list;

        //Carrega lista de estados do provider
        this.$statesList = statesList.statesList;

        //Carrega lista de profissões
        this.$careerList = careerList.list;
        
        //Adicionar item "Outros" para inserção de carreira não existente
        if( this.$careerList.indexOf('Outros') <= -1) {
            this.$careerList.push('Outros');
        }

        //Carregar campos de visibilidade
        visibilityList.load().then(() => {
            this.visibility = visibilityList.table
        });

    }

    //Função que inicializa
    ngOnInit() {

        //Atribui dados do usuário
        this.user.getUserData().then((resp:boolean) => {

            if(!resp) return;
            
            //Adicionando valores a classe user
            let atributes = this.user._user;

            //Intera sobre objeto e atribui valor aos modelos de metadata
            for (var key in atributes.metadata) {
                if (atributes.metadata.hasOwnProperty(key) && this[key] != undefined) {
                    this[key] = atributes.metadata[key];
                }
            }

            //Atribuindo dados aos modelos
            this.display_name = atributes.display_name;
            this.user_email = atributes.user_email;
            this.type = atributes.type.ID;

            //Se cadastrado item "Outros" em profissão já abrir campo de input livre
            if( this.$careerList.indexOf(atributes.metadata.career.value) <= -1) {
                this.other_career = atributes.metadata.career.value; //atribuir valor salvo
                this.career.value = 'Outros'; //abrir campo livre
            }

            //Retorna seleção de visibilidade
            this.user._visibilityObservable.subscribe((resp: any) => {
                if (Object.keys(resp).length > 0) {
                    this.visibility = resp;
                }
            });

        });
        
    }

    //Fazer pesquisa de CEP (API) ao preencher todos numeros
    queryZipcode($event) {
        let input       = $event.target;
        let validacao   = /^[0-9]{5}[0-9]{3}/i;
        let regex       = input.value.search(validacao); 
    
        if (regex == 0) {
            this.zipcodeService.setCEP(input.value);
            this.zipcodeService.getAdressData().subscribe((data:any) => {

                //Se houve erro no retorno
                if (data.erro  != undefined) {
                    return this.toastCtrl.create({
                        message: "CEP não válido. Preencha corretamento o cep de seu endereço.",
                        duration: 2000
                    }).present();
                }

                this.address.value       = data.logradouro;
                this.neighbornhood.value = data.bairro;
                this.city.value          = data.localidade;
                this.state.value         = data.uf; 
            })
        }
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Campos válidos
        let saveFields: any = {
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
            career: {
                value:<string>'',
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

        //Em caso de usuário especificar carreira não presente na lista
        if(this.other_career != undefined) {
            saveFields.career.value = this.other_career; //Adiciona valor novo
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
    dismiss($data: any = null) {
        this.viewCtrl.dismiss($data);
    }

}
