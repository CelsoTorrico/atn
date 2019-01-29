import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Nav, NavController, ModalController } from 'ionic-angular';

@Component({
    selector: 'member-chat',
    template: `
            <button class="btn-cursor" ion-item (click)="openRoom(room.user.ID, $event)">
                <ion-avatar item-start *ngIf="room.user.profile_img" >
                    <img [src]="room.user.profile_img.value" />
                </ion-avatar>
                <h2>{{ room.user.display_name | titlecase }}</h2>
                <p *ngIf="room.last_update">{{ room.last_update | date }}</p>
                <ion-note item-end ><ion-badge>{{ room.quantity_messages }}</ion-badge></ion-note>
            </button>             
    `,
    styles: [``]
})
export class MemberChat {

    @Input() public room: any;

    @Output() clickEvent = new EventEmitter<number>();

    constructor(public modal: ModalController, public navCtrl: NavController, public nav: Nav) { }

    //Abre uma nova página de profile
    openRoom($room_id: number, $event) {
        $event.preventDefault();
        this.clickEvent.emit($room_id);
    }
}