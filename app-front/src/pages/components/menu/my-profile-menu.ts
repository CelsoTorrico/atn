import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[] 

@Component({
  selector: 'my-profile-menu', 
  template: `
        <ion-buttons>

            <button ion-button outline small icon-end *ngFor="let p of pages" (click)="goToPage(p)">
                {{ p.title }}
            </button>

        </ion-buttons>
  `,
  styles: [``]
})
export class MyProfileMenu {
  
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav; 

  pages: PageList;

  constructor(public navCtrl: NavController) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Profile',    component: 'MyProfilePage' },
      { title: 'My Sports',     component: 'MyProfileSportsPage' },
      { title: 'My Stats',      component: 'MyProfileStatsPage' }
    ];
  }

  ionViewDidLoad() {
    console.log('Hello NavMenu Loaded');
  }

  //Abre uma nova página de profile
  goToPage($page: PageItem, $data:any = ''){
    this.navCtrl.push($page.component); 
  }
  
}
