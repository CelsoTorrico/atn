import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'member-current-user',
    template: `
            <button class="btn-cursor" ion-item (click)="goToProfile(member.ID)">
                <h2>Olá, <strong>{{ member.display_name | titlecase }}</strong></h2>
                <ion-avatar item-end>
                    <img *ngIf="member.profile_img" [src]="member.profile_img.value" /> 
                </ion-avatar>
                <ion-note item-end >V</ion-note>
            </button>             
    `,
    styles: [`
    button, button.activated{
        padding:0px;
        background-color: transparent;
        color: #fff;
    }
    
    h2{
        font-weight: 300;
        text-align: right;
        color: #fff !important;
    }

    ion-avatar{
        background-color: #a52e2e;
        border-radius: 50%;
    }
    `]
})
export class MemberUser{

    @Input() public member:any;

    constructor(public navCtrl:NavController){

    }

    //Abre uma nova página de profile
    goToProfile($user_id:number){
        /*this.navCtrl.push('MyProfilePage', { 
        user_id: $user_id
        });*/ 
    }
}