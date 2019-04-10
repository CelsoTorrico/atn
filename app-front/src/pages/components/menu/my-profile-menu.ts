import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[] 

@Component({
  selector: 'my-profile-menu', 
  template: `
        <ion-buttons>

            <button ion-button outline small icon-end *ngFor="let p of pages" (click)="goToStep(p)">
                {{ p.title | translate }}
            </button>

        </ion-buttons>
  `,
  styles: [``]
})
export class MyProfileMenu {
  
  pages: PageList;
  componentToOpen:any;

  @Output() changeStepEvent = new EventEmitter<any>();

  constructor(public translateService: TranslateService) { 
    
    this.translateService.setDefaultLang('pt-br');
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'MY_PROFILE',    component: 'personalData' },
      { title: 'MY_SPORTS',     component: 'sportsData' },
      { title: 'MY_STATS',      component: 'statsData' }
    ];
  }

  ionViewDidLoad() {
    
  }

  //Abre uma nova página de profile
  goToStep($page: PageItem){
    this.changeStepEvent.emit($page.component);
  }
  
}
