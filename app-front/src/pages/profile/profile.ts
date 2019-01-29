import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  
  item: any;

  public $ID:number;

  public currentUserData:any = {
      ID: '',
      display_name: '',
      sport: '', 
      metadata: {
          profile_img: {
              value: '' 
          },
          formacao:{
            value:'' 
          }
      },
      videos: []
  };

  public favoriteMembers:any[];

  public loginErrorString;

  private $getProfile:string = 'user/self';
  
  constructor(
      public navCtrl: NavController,
      public user: User,
      public api: Api,
      public toastCtrl: ToastController,
      public translateService: TranslateService,
      private params: NavParams,
      private browser: InAppBrowser ) {

      this.translateService.get('LOGIN_ERROR').subscribe((value) => {
          this.loginErrorString = value;
      })

      //Adicionando enviadors da view anterior
      this.$ID = this.params.get('user_id');

      //Define requisiçaõ para mostrar dados
      if(this.$ID != undefined) {
        //Adiciona url para exibir perfis de conexão
        this.$getProfile = 'user/' + this.$ID; 
      }

  }

  //Função que inicializa
  ngOnInit() {

    //Carrega dados do usuário de contexto
    this.currentUser();

    //Somente exibe favoritos para usuário logado
    if(this.$ID == undefined)
        this.getFavoriteMembers();
    
}

  private currentUser(){

      //Retorna a lista de esportes do banco e atribui ao seletor
      this.user._user = this.api.get(this.$getProfile).subscribe((resp:any) => {

          //Se não existir items a exibir
          if(resp.length <= 0){
              return;
          }
          
          //Adicionando valores a variavel global
          this.currentUserData = resp;
          
          //Workaround para parametro de objeto sem acesso direto
          let $vParameter = 'my-videos';
          
          //Atribui valores ao objeto
          this.currentUserData.videos = resp.metadata[$vParameter];

      }, err => { 
          return; 
      });

  }

  private getFavoriteMembers(){
    //Retorna a lista de esportes do banco e atribui ao seletor
    this.user._user = this.api.get('favorite').subscribe((resp:any) => {

        //Se não existir items a exibir
        if(resp.length <= 0){
            return;
        }
        
        //Adicionando valores a variavel global
        this.favoriteMembers = resp;

    }, err => { 
        return; 
    });
  }

  downloadPDF(){
        //Adiciona Id do usuário corrente
        let $id = this.currentUserData.ID;
        
        this.browser.create('http://localhost/desenvolvimento/app-atletasnow-2.0/app/public/user/pdf/' + $id, '_blank'); 
  }

}
