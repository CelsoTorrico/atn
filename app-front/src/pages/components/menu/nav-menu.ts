import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[] 

@Component({
  selector: 'nav-menu',
  template: `
      <ion-list>
        <nav>
            <ul class="list-inline">
                <li *ngFor="let p of pages" (click)="goToPage(p)">
                  <span class="button-atletas">{{ p.title }}</span>
                </li>
            </ul>                        
        </nav>
      </ion-list>
  `,
  styles: [`
  ion-list{
    margin: 0px;  
  }
  `]
})
export class NavMenu {
  
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav; 

  pages: PageList;

  constructor(public navCtrl: NavController) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Favorite',  component: 'FavoritePage' },
      { title: 'Learn',     component: 'LearnPage' },
      { title: 'Messages',  component: 'ChatPage' }
    ];
  }

  ionViewDidLoad() {
    console.log('Hello NavMenu Loaded');
  }

  //Abre uma nova página de profile
  goToPage($page: PageItem, $data:any = ''){
    this.navCtrl.push($page.component, {currentUser: $data}); 
  }

  openPage(page: PageItem) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}
