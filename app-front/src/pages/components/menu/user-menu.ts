import { Api } from './../../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';

@Component({
  selector: 'user-menu', 
  template: `
        <button ion-button clear icon-only class="learn-icon">
            <img src="assets/img/dashboard/learn-icon.png"/>
        </button>

        <button ion-button clear icon-only class="logout-icon">
            <img src="assets/img/dashboard/logout-icon.png"/>
        </button>
  `,
  styles: [``]
})
export class UserMenu { 
  
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav; 

  constructor(
      public navCtrl: NavController,
      public api: Api) {}

      //Função que inicializa
    ngOnInit() {
        
    }
  
}
