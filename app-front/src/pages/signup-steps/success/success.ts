import { DashboardPage } from './../../dashboard/dashboard';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/* Success Class*/
@Component({
    templateUrl: "success.html"
})
export class SuccessStepPage{

    constructor(
        private navCtrl:NavController, 
        public translateService: TranslateService) { 
    
        this.translateService.setDefaultLang('pt-br');

    }

    goToDashboard() {
        this.navCtrl.push('Dashboard');
    }

}