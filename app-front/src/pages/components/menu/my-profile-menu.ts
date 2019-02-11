import { Component, Output, EventEmitter } from '@angular/core';

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
                {{ p.title }}
            </button>

        </ion-buttons>
  `,
  styles: [``]
})
export class MyProfileMenu {
  
  pages: PageList;
  componentToOpen:any;

  @Output() changeStepEvent = new EventEmitter<any>();

  constructor() {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Profile',    component: 'personalData' },
      { title: 'My Sports',     component: 'sportsData' },
      { title: 'My Stats',      component: 'statsData' }
    ];
  }

  ionViewDidLoad() {
    
  }

  //Abre uma nova página de profile
  goToStep($page: PageItem){
    this.changeStepEvent.emit($page.component);
  }
  
}
