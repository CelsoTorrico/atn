import { ClubComponent } from './../profile/profile-components/club.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, ModalController, IonicPage, NavParams } from 'ionic-angular';
import { Api } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from 'angular2-chartjs';
import * as html2canvas from 'html2canvas';
import * as jspdf from '../../../node_modules/jspdf';

@IonicPage({
  segment: 'report'
})
@Component({
  selector: 'report',
  templateUrl: 'report.html'
})
export class ReportPage {

  /**
   * html2canavas => Apenas versão 1.0.0-rc1 funciona com essa versão do TypeScript
   * Referencia: https://itnext.io/javascript-convert-html-css-to-pdf-print-supported-very-sharp-and-not-blurry-c5ffe441eb5e 
   **/
  h2c = html2canvas;
  jspdf = jspdf;

  @ViewChild(ChartComponent) chart: ChartComponent;

  clubComponent: ClubComponent;

  reportData: any = {};

  listUsers: any = [];

  fields: any = []

  //Chart - Estatistica
  typeChart = 'pie';

  data = {
    labels: [],
    datasets: [
      {
        label: "Relatório",
        data: [],
        backgroundColor: ['blue', 'purple', 'red'],
        borderWidth: [0, 0, 0],
        borderColor: ['rgba(0,0,0,0)']
      }
    ]
  };

  options = {
    legend: {
      display: true
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public api: Api,
    public toastCtrl: ToastController,
    public alert: AlertController,
    public modalCtrl: ModalController,
    public domSanitizer: DomSanitizer,
    public translateService: TranslateService) {

    //Dados enviados pela view anterior
    this.reportData = params.get('data'); //dados do relatório
    this.clubComponent = params.get('component'); //component da view anterior

    //Atribuindo parametros da query
    this.fields = (this.reportData.fields != undefined) ? this.reportData.fields[1] : 0;

    //Atribuindo lista de usuários da query
    this.listUsers = (this.reportData.users[1] != undefined) ? this.reportData.users[1] : 0;

    //Chart Labels
    this.data.labels = [this.reportData.total[0], this.reportData.found[0]];

    //Chart Data 
    this.data.datasets[0].data = [this.reportData.total[1] - this.reportData.found[1], this.reportData.found[1]];

  }

  ngOnInit() {
    this.queryParameters();
  }

  queryParameters(): any[] {

    let $data: any = [];

    for (const f in this.fields) {

      if (f == 'sport') {
        for (const el of this.fields[f]) {
          $data.push({ type: f + el, term: el });
        }
        continue;
      }

      $data.push({ type: f, term: this.fields[f] });
    }

    return this.fields = $data;
  }

  /** Exporta os relatório utilizando classe clubComponent */
  exportReport($isPdf: boolean = false) {

    //Exportar Formato Excel
    if (!$isPdf) {
      return this.clubComponent.exportReport(false);
    }

    //Converte domElement em PDF
    const filename = "export.pdf";
    let domHtmlElement = document.getElementById('report-windows');
    this.h2c(domHtmlElement).then(canvas => {
      let jspdf = this.jspdf('p', 'mm', 'a4');
      jspdf.addImage(canvas.toDataURL('image/png'), 'PNG', 1, 1);
      jspdf.save(filename);
    });

  }

  /* Abre uma nova página */
  backButton() {
    if (this.navCtrl.canSwipeBack()) {
      this.navCtrl.getPrevious();
    } else {
      this.navCtrl.setRoot('Dashboard');
    }
  }


}
