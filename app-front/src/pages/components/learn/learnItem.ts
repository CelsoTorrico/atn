import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'learn-item',
  template: `
  <ion-item class="btn-cursor" (click)="goToPost(currentLearnItem.ID)">
    <ion-item-divider>
    <ion-row>
    <ion-col col-md-8>
        
        <ion-thumbnail float-left margin-right slot="start" *ngIf='currentLearnItem.attachment'>
            <img [src]="currentLearnItem.attachment" />
        </ion-thumbnail> 

        <h2>{{ currentLearnItem.post_title }}</h2>

        <p>{{ currentLearnItem.post_excerpt }}</p>

        <ion-list>
          <ion-list>
                <p>
                  {{ "FROM" | translate }} {{ currentLearnItem.post_author.display_name }}
                </p>
                <p><small>{{ currentLearnItem.post_date | date }}</small></p>
              </ion-list>
        </ion-list>                
    </ion-col>
    <ion-col>
        
        <ion-buttons>

            <ion-badge start>
                {{ currentLearnItem.quantity_comments }}
            </ion-badge>           
             
        </ion-buttons>
        
    </ion-col>
  </ion-row>
    
    </ion-item-divider>
    
  </ion-item>  
  `,
  styles: [`
    ion-item{
      border-bottom: 1px solid #ddd;
    }  

    h2{
      font-size: 2.0rem;
      margin-bottom: 20px;
      white-space: normal !important;
    }

    ion-label{
      white-space: normal !important;
    }

  `]
})
export class LearnItem {

  public $postID: number;

  @Input() public currentLearnItem: any = {
    ID: '',
    attachment: '',
    guid: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: {

      }
    },
    post_content: '',
    post_date: '',
    post_type: '',
    quantity_comments: ''
  };

  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService) { 
      this.translateService.setDefaultLang('pt-br')

  }

  //Retorna
  ngOnInit() {

  }

  //Abre uma nova página de profile
  goToPost($post_id: number) {
    this.navCtrl.push('PostPage', {
      post_id: $post_id
    });
  }

}
