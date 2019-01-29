import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
    selector: 'member-item',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col col-md-2 col-3 *ngFor="let member of members">
                    <ion-item class="btn-cursor" (click)="goToProfile(member.ID)">
                        <ion-avatar>
                            <ion-img class="img-center" [src]="member.profile_img.value"></ion-img>
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