import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User, Api } from '../../../providers';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'team-data-edit',
    templateUrl: 'team-data.html'
})
export class MyProfileAddMemberDataComponent {

    page_title:string = "ADD_NEW_MEMBER";

    $user_id: number

    display_name: string

    user_email: string

    user_pass:string

    confirm_pass:string

    type:number = 1;

    //Url de requisição de usuário
    private static readonly $getProfile: string = 'user/self/club_user'
    
    private method:string = 'post'

    public loginErrorString

    public loading_placeholder

    //Lista de tipos de usuário
    protected $typeUserList = [
        {valor: 1,  texto: 'Atleta'}, 
        {valor: 2,  texto: 'Profissional do Esporte'}
    ];

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public translateService: TranslateService,
        private loading: LoadingController,
        public params: NavParams) { 
    
        this.translateService.setDefaultLang('pt-br');

        this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
            this.loading_placeholder    = data.LOADING;
        });

        this.$user_id = this.params.get('data');

    }

    //Função que inicializa
    ngOnInit() {
        
        //No caso de editar usuário
        if(this.$user_id != undefined){
            //Atribui classe de usuário
            let user = this.user.getUser(this.$user_id);

            //Faz requisição de dados de usuário
            user._userObservable.subscribe((resp:any) => {

                //Sem resposta retorna
                if(Object.keys(resp).length <= 0){
                    return;
                }

                //Atribuindo dados aos modelos
                this.page_title = "UPDATE_MEMBER";
                this.method = "put";
                this.display_name = resp.display_name;
                this.user_email = resp.user_email;
                this.type = resp.type.ID;

            });
        }

    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        //Loading
        const loading = this.loading.create({ 
            content: this.loading_placeholder 
        });

        loading.present();

        //Campos válidos
        let saveFields = {
            display_name: null,
            user_email: null,
            user_pass: null,
            confirm_pass: null,
            type: null,           
        }

        //Intera sobre objeto e atribui valor aos modelos de metadata
        for (var key in saveFields) {
            if (this.hasOwnProperty(key) && this[key] != undefined) {
                saveFields[key] = this[key];
            }
        }

        //Se for update, adicionar ID de usuário
        let url = (this.$user_id != undefined)? '/' + this.$user_id : '';
        let method = this.method;

        //Realiza update de dados do usuario
        this.api[method](MyProfileAddMemberDataComponent.$getProfile + url, saveFields).subscribe((resp:any) => {
            
            if(Object.keys(resp).length <= 0 ){
                return;
            }

            //Fechar tela de loading
            loading.dismiss();

            //Fechar modal e passar data para pai
            this.dismiss(resp); 

        });
    }

    //Fechar modal e passar dados obtidos
    dismiss($data:any = null){
        this.viewCtrl.dismiss($data);
    }

}
