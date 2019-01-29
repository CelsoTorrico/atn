import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'member-list',
    template: `
            <button class="btn-cursor" ion-item (click)="goToProfile(member.ID)">
                <ion-avatar item-start *ngIf="member.profile_img" >
                    <img [src]="member.profile_img.value" />
                </ion-avatar>
                <h2>{{ member.display_name | titlecase }}</h2>
                <p>Profissão</p>
                <ion-note item-end >Favoritar</ion-note>
            </button>             
    `,
    styles: [``]
})
export class MemberList{

    @Input() public member:any;

    constructor(public navCtrl:NavController){

    }

    //Abre uma nova página de profile
    goToProfile($user_id:number){
        this.navCtrl.push('ProfilePage', {
        user_id: $user_id
        }); 
    }
}