import { DashboardPage } from './../../dashboard/dashboard';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/* Success Class*/
@IonicPage({
    name: 'SuccessStep',
    segment: 'success-step'
})
@Component({
    templateUrl: "success.html"
})

export class SuccessStep{

    constructor(private navCtrl:NavController){}

    goToDashboard() {
        this.navCtrl.push(DashboardPage);
    }

}