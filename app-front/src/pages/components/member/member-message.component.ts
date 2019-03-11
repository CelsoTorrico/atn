import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Nav, NavController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'member-chat',
    template: `
            <button [id]="'chat'+room.user.ID" class="btn-cursor" ion-item (click)="openRoom(room.user.ID, $event)">

                <ion-avatar class="btn-cursor" item-start>
                    <img *ngIf="room.user.profile_img, else elseBlock" 
                    [src]="room.user.profile_img.value" />
                    <ng-template #elseBlock>
                        <img src="assets/img/user.png" [title]="room.user.display_name" />
                    </ng-template>
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

    constructor(
        public modal: ModalController, public navCtrl: NavController, public nav: Nav,public translateService: TranslateService) { 
        this.translateService.setDefaultLang('pt-br'); 
    }

    //Abre uma nova página de profile
    openRoom($room_id: number, $event) {
        $event.preventDefault();
        this.clickEvent.emit($room_id);
    }
}