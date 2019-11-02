import { DomSanitizer } from '@angular/platform-browser';
import { Api } from './../../../providers/api/api';
import { ProfileComponent } from './profile.component';
import { MyProfileStatsComponent } from './../../my-profile/stats-data/stats-data.component';
import { ModalController, ToastController, LoadingController, NavController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { StatsList } from '../../../providers/useful/stats';
import { MyProfileGeneralStatsComponent } from '../../my-profile/general-stats-data/general-stats-data.component';
import { MyProfileAchievementsComponent } from '../../my-profile/achievements-data/achievements-data.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'profile-stats',
  templateUrl: "stats.html",
  animations: [

  ]
})
export class StatsComponent extends ProfileComponent {

  isLogged: boolean = false;

  general: any = {
    jogos: null,
    vitorias: null,
    empates: null,
    derrotas: null,
    titulos: null,
    ['titulos-conquistas']: null
  }

  performance: any = {
    stats: null
  }

  reloadStats:any;

  constructor(
    public statsList: StatsList,    
    public navCtrl: NavController,
    public api: Api,
    public toastCtrl: ToastController,
    public alert: AlertController,
    public modalCtrl: ModalController,
    public domSanitizer: DomSanitizer,
    public translateService: TranslateService,
    private loadingCtrl: LoadingController) {

    super(navCtrl, api, toastCtrl, alert, modalCtrl, domSanitizer, translateService);

    this.translateService.setDefaultLang('pt-br');

  }

  //Retorna
  ngOnInit() {
    
    //Atribuindo metódo a variavel
    this.reloadStats = function() { 
      this.getStats();
    };

    this.getStats();
  }

  //Retorna estatisticas
  getStats() {

    this.user._statsObservable.subscribe((resp: any) => {

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

  //Editar dados gerais e recarregar dados após atualização
  editGeneralStats() {
    this.editData('generalData', undefined, () => { 
      this.getStats();
    });    
  }

  //Editar conquistas e recarregar dados após atualização
  editAchievements() {
    this.editData('achievementsData', undefined, () => { 
      this.getStats();
    });    
  }

  //Editar estatisticas de esportes e recarregar dados após atualização
  editSportsStats() {
    this.editData('statsData', undefined, () => { 
      this.getStats();
    });    
  }

}