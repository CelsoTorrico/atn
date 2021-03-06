import { Component, ViewChild, Input } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

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
                  <span class="button-atletas">
                    {{ p.title | translate }}
                    <ion-badge class="messageCount" *ngIf="p.title == 'MESSAGES' && messageCount > 0">
                      {{ messageCount }}
                    </ion-badge>
                  </span>
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

  @Input() messageCount:number = 0;

  pages: PageList;

  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService) { 
    
    this.translateService.setDefaultLang('pt-br');
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'FAVORITE',  component: 'Favorite' },
      { title: 'LEARN',     component: 'Learn' },
      { title: 'MESSAGES',  component: 'Chat' }
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
