import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'learn-item',
  template: `
    <ion-item>
        <ion-item-divider>
            <ion-row>
                <ion-col>
                    <ion-list>
                        <ion-thumbnail slot="start">
                            <img />
                        </ion-thumbnail>
                        {{ currentLearnItem.post_content }}

                        <ion-item>
                            <ion-list>
                                {{ "AUTHOR" | translate }}: {{ currentLearnItem.post_author.display_name }}

                                {{ "RELEASE" | translate }}: {{ currentLearnItem.post_date | date }}

                                {{ "COMMENTS" | translate }}:
                                <ion-badge>
                                    {{ currentLearnItem.quantity_comments }}
                                </ion-badge>                                

                            </ion-list>
                        </ion-item>

                    </ion-list>                    
                </ion-col>
                <ion-col col-2>
                    Viz
                </ion-col>
                <ion-col>
                    <button ion-button end (click)="goToPost(currentLearnItem.ID)">
                        {{ "Ver mais" | translate }}
                    </button>
                </ion-col>
            </ion-row>
        </ion-item-divider>
    </ion-item>
  ` 
})
export class LearnItem {

  public $postID:number;
  
  @Input() public currentLearnItem:any = {
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
    public navCtrl: NavController ) {
                
    } 

  //Retorna
  ngOnInit() {
    
  } 

  //Abre uma nova página de profile
  goToPost($post_id:number){
    this.navCtrl.push('PostPage', {
        post_id: $post_id
    }); 
  }

}
