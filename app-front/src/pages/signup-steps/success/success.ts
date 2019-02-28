import { DashboardPage } from './../../dashboard/dashboard';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/* Success Class*/
@IonicPage({
    name: 'SuccessStep',
    segment: 'success-step'
})
@Component({
    templateUrl: "success.html"
})

export class SuccessStep{

    constructor(
        private navCtrl:NavController, 
        public translateService: TranslateService) { 
    
        this.translateService.setDefaultLang('pt-br');

    }

    goToDashboard() {
        this.navCtrl.push(DashboardPage);
    }

}