import { MyProfileStatsComponent } from './../../my-profile/stats-data/stats-data.component';
import { ModalController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { MyProfileGeneralStatsComponent } from '../../my-profile/general-stats-data/general-stats-data.component';
import { MyProfileAchievementsComponent } from '../../my-profile/achievements-data/achievements-data.component';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'profile-stats',
  templateUrl: "stats.html",
  animations: [
     
  ]
})
export class StatsComponent {

  profile: Observable<ArrayBuffer> 
  stats: Observable<ArrayBuffer> 

  isLogged:boolean = false;

  type: number = null; 

  sport: any[] = []; 

  general:any = {
    jogos: null,
    vitorias: null,
    empates: null,
    derrotas: null,
    titulos: null,
    ['titulos-conquistas']: null  
  }

  performance:any = {
    stats : null
  }

  private ListComponents: any = {
    generalData       : MyProfileGeneralStatsComponent,
    achievementsData  : MyProfileAchievementsComponent,
    statsData         : MyProfileStatsComponent
  }

  constructor(
    private modalCtrl: ModalController,
    public statsList: StatsList,
    private toastCtrl: ToastController,
    public translateService: TranslateService) { 
      this.translateService.setDefaultLang('pt-br'); 
    }

  //Retorna
  ngOnInit() {
    this.fillUserData();
  }

  //Adiciona valores as variaveis globais
  fillUserData() {

    this.profile.subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) { 
        return;
      }

      //Adicionando valores as variavel global
      let atributes = resp;

      //Atribuindo dados aos modelos
      this.type = atributes.type.ID;
      this.sport = atributes.sport;

      //Retorna s estatisticas do usuario
      this.getStats();

    }, err => {
      return;
    });

  }

  //Retorna estatisticas
  getStats() {
    this.stats.subscribe((resp: any) => {

      //Se não existir items a exibir
      if (resp.length <= 0) {
        return;
      }

      for (const key in resp.general) {
        if (this.general.hasOwnProperty(key)) {
          this.general[key] = resp.general[key];           
        }
      }

      //Atribui dados de performance a model
      this.performance = resp.performance; 

    }, err => {
      return; 
    });
  }

  //Abrir modal passando ID do usuário para alteração
  editMember($user_id:number){
    this.editData('teamData', $user_id );
  }

  //Abrir modal com dados para atualizar perfil
  editData($component: string, $data:any = undefined){ 

    //Criar modal do respectivo component
    let modal = this.modalCtrl.create(this.ListComponents[$component], {data: $data});
    modal.onDidDismiss((data) => {

        if(data == null){
          return;
        }
        
        if (Object.keys(data).length <= 0) {
          return;
        }

        if(data.error != undefined){
          return;
        }

        //Retorna mensagem proveninete do servidor
        let responseText = data.success[Object.keys(data.success)[0]];

        //Mostrar resposta
        let toast = this.toastCtrl.create({
            message:  responseText,
            duration: 3000,
            position: "bottom"
        });

        toast.present();

        //Recarregar dados do profile
        this.fillUserData();
        
    });

    //Inicializar modal
    modal.present();

  }

  private subsChar(c) {

    let chars = {
      'Š': 'S', 'š': 's', 'Ž': 'Z', 'ž': 'z', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'A', 'Ç': 'C', 'È': 'E', 'É': 'E',
      'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ù': 'U',
      'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ý': 'Y', 'Þ': 'B', 'ß': 'Ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'a', 'ç': 'c',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'o', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o',
      'ö': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ý': 'y', 'þ': 'b', 'ÿ': 'y',
      ' ': '-'
    };

    return chars[c];
  }


}