import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[]

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav; 

  rootPage: any = 'ContentPage'; 

  pages: PageList;

  constructor(public navCtrl: NavController,
    public translateService: TranslateService) { 

      this.translateService.setDefaultLang('pt-br'); 
      
      // used for an example of ngFor and navigation
      this.pages = [
      { title: 'Dashboard', component: 'DashboardPage' },
      { title: 'Favorite', component: 'FavoritePage' },
      { title: 'Learn', component: 'LearnPage' }
    ];
  }

  ionViewDidLoad() {
     
  }

  openPage(page: PageItem) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
