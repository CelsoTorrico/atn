import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[] 

@Component({ 
  selector: 'footer-app',
  templateUrl: ''
})
export class FooterApp {
  
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav; 

  pages: PageList;

  constructor(public navCtrl: NavController) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Privacy',  component: 'ChatPage' },
      { title: 'About',     component: 'ChatPage' },
      { title: 'Terms & Conditions',  component: 'ChatPage' },
      { title: 'Support',  component: 'ChatPage' },
      { title: 'Purchase License',  component: 'ChatPage' }
    ];
  }

  ionViewDidLoad() {
    
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
