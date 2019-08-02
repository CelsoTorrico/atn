import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'member-club',
    template: `
    <ion-col col-4 col-md-3 col-auto class="btn-cursor">

        <ion-avatar (click)="goToProfile(member.ID)">
            <img class="img-center" *ngIf="member.profile_img, else elseBlock" 
            [src]="member.profile_img.value" />
            <ng-template #elseBlock>
                <img src="assets/img/user.png" class="img-center" 
                [title]="member.display_name" />
            </ng-template>
        </ion-avatar>
                
        <h3>{{ member.display_name | stringTitlecaseSpecialChars }}</h3>
        <p><small>{{ member.type.type }}</small></p>

        <div class="edit-buttons"> 

            <ion-buttons>
                <button edit-profile ion-button small start clear (click)="editMember(member.ID);">
                    {{ "EDIT" | translate }}
                </button>

                <button edit-profile ion-button small end clear (click)="deleteMember(member.ID);">
                    {{ "DELETE" | translate }}
                </button>
            </ion-buttons>

        </div><!-- member -->

    </ion-col>                
    `,
})
export class MemberClub {

    @Output() public editMemberAction: EventEmitter<any> = new EventEmitter()
    @Input()  public member:any;

    constructor(public navCtrl: NavController,
        public translateService: TranslateService) {
        this.translateService.setDefaultLang('pt-br');
    }

    /** Emite evento para editar usuário */
    editMember($user_id: number) {
        this.editMemberAction.emit({
            type: 'edit',
            user_id: $user_id 
        });
    }

    /** Emite evento para deletar usuário */
    deleteMember($user_id: number) {
        this.editMemberAction.emit({
            type: 'delete',
            user_id: $user_id
        });
    }

    //Abre uma nova página de profile
    goToProfile($user_id: number) {
        this.navCtrl.push('Profile', {
            user_id: $user_id
        });
    }
}