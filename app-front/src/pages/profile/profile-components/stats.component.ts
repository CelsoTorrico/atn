import { MyProfileStatsComponent } from './../../my-profile/stats-data/stats-data.component';
import { ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { MyProfileGeneralStatsComponent } from '../../my-profile/general-stats-data/general-stats-data.component';
import { MyProfileAchievementsComponent } from '../../my-profile/achievements-data/achievements-data.component';
import { Observable } from 'rxjs/Observable';

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
    public statsList: StatsList) { }

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

  /*sport() {
    //Adicionando campos de acordo com os esportes definidos
    this.sport.forEach(element => {

      //retorna esporte atual
      let sport = element.sport_name;

      //Faz a modificação de cada letra para padrão usado
      for (var i = 0; i < element.sport_name; i++) {
        let currentChar = element.sport_name.charAt(i);
        let changed = this.subsChar(currentChar);
        sport.replace(currentChar, changed);
      }

      //Nome do esporte reformatado
      let sport_name = sport.toLowerCase();

      //Adiciona ao array de objetos
      this.statsToPage.push({
        [sport_name]: this.statsList.statsList[sport_name]
      });

    });
  }*/

  //Abrir modal com dados para atualizar perfil
  editData($component:string){ 

    //Criar modal do respectivo component
    let modal = this.modalCtrl.create(this.ListComponents[$component], {});
    
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