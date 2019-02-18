import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
    selector: 'member-item',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col col-md-3 col-auto *ngFor="let member of members">
                    <ion-item class="btn-cursor" (click)="goToProfile(member.ID)">

                            <ion-avatar item-start>
                                <img class="img-center" *ngIf="member.profile_img, else elseBlock" 
                                [src]="member.profile_img.value" />
                                <ng-template #elseBlock>
                                    <img src="assets/img/user.png" class="img-center" [title]="member.display_name" />
                                </ng-template>
                            </ion-avatar>
                                             
                        {{ member.display_name | titlecase }}
                    </ion-item>
                </ion-col> 
            </ion-row>
        </ion-grid>               
    `,
    styles: [`

        ion-item{
            text-align: center;
            font-size: 1.1rem !important;
        }

        ion-avatar{
            margin-bottom: 10px;
        }
    `]
})
export class MemberItem{

    @Input() public members:any[];

    constructor(public navCtrl:NavController){

    }

    //Abre uma nova página de profile
    goToProfile($user_id:number){
        this.navCtrl.push('ProfilePage', {
        user_id: $user_id
        }); 
    }
}