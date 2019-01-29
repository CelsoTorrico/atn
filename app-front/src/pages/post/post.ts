import { Api } from '../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostPage {
  
  public $ID:number;

  public currentPostItem:any = {
    ID: '',
    attachment: '',
    guid: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: {

      }
    },
    post_content: '',
    post_date: '',
    post_type: '',
    quantity_comments: ''
  }; 

  public favoriteMembers:any[];

  public loginErrorString;

  private $getPostUrl:string = 'learn/';
  
  constructor(
      public navCtrl: NavController,
      public user: User,
      public api: Api,
      public toastCtrl: ToastController,
      public translateService: TranslateService,
      private params: NavParams ) {

      this.translateService.get('LOGIN_ERROR').subscribe((value) => {
          this.loginErrorString = value;
      })

      //Adicionando enviadors da view anterior
      this.$ID = this.params.get('post_id');

  }

    //Função que inicializa
    ngOnInit() {

        //Carrega dados do usuário de contexto
        this.getPost();
    
    }   
    
    public setPostUrl(){
        //Adiciona url para exibir perfis de conexão
        return this.$getPostUrl = ''; 
    }

    public getPost(){

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.user._user = this.api.get(this.$getPostUrl + this.$ID).subscribe((resp:any) => {

            //Se não existir items a exibir
            if(resp.length <= 0){
                return;
            }
            
            //Adicionando valores a variavel global
            this.currentPostItem = resp;

        }, err => { 
            return; 
        });

    }


}
