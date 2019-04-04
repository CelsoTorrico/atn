import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'member-item',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col col-md-3 col-auto *ngFor="let member of members" class="btn-cursor" (click)="goToProfile(member.ID)">
                    
                    <ion-avatar>
                        <img class="img-center" *ngIf="member.profile_img, else elseBlock" 
                        [src]="member.profile_img.value" />
                        <ng-template #elseBlock>
                            <img src="assets/img/user.png" class="img-center" 
                            [title]="member.display_name" />
                        </ng-template>
                    </ion-avatar>
                             
                    <h3>{{ member.display_name | stringTitlecaseSpecialChars }}</h3>

                </ion-col> 
            </ion-row>
        </ion-grid>               
    `,
})
export class MemberItem{

    @Input() public members:any[]; 

    constructor(public navCtrl:NavController,
        public translateService: TranslateService) { 
            this.translateService.setDefaultLang('pt-br'); 

    }

    //Abre uma nova página de profile
    goToProfile($user_id:number){
        this.navCtrl.push('ProfilePage', {
        user_id: $user_id
        }); 
    }
}