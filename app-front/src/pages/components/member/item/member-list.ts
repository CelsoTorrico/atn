import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'member-list',
    template: `
            <ion-card>
                <button class="btn-cursor" ion-item (click)="goToProfile(member)">
                    
                    <ion-avatar item-start>
                        <img *ngIf="member.profile_img, else elseBlock" 
                        [src]="member.profile_img" />
                        <ng-template #elseBlock>
                            <img src="assets/img/user.png" [title]="member.display_name" />
                        </ng-template>
                    </ion-avatar>

                    <h2>{{ member.display_name | stringTitlecaseSpecialChars }}</h2>
                </button> 
            </ion-card>                         
    `,
    styles: [``]
})
export class MemberList {

    @Input() public member;

    constructor(public navCtrl: NavController,
        public translateService: TranslateService) { 
            this.translateService.setDefaultLang('pt-br'); 
        }

    //Abre uma nova página de profile
    goToProfile($user: any) {
        this.navCtrl.push('Profile', { 
            user_id:    $user.ID,
            user_login: $user.user_login
        });
    }
}