import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'member-item',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col col-4 col-md-3 col-auto *ngFor="let member of members" class="btn-cursor" (click)="goToProfile(member)" [ngClass]="{'disabled': member.status && member.status == 1}">
                    
                    <ion-avatar>
                    <img class="img-center" *ngIf="member.profile_img, else elseBlock" 
                        [src]="member.profile_img.value" />
                        <ng-template #elseBlock>
                            <img src="assets/img/user.png" class="img-center" 
                            [title]="member.display_name" />
                        </ng-template>

                        <ion-badge class="user-inative" *ngIf="member.status && member.status == 1">
                            {{ "DISABLED_USER" | translate }}
                        </ion-badge>

                    </ion-avatar>
                             
                    <h3>{{ member.display_name | stringTitlecaseSpecialChars }}</h3>
                    <p><small>{{ member.type.type }}</small></p> 

                </ion-col> 
            </ion-row>
        </ion-grid>               
    `,
})
export class MemberItem {

    @Output() editMemberAction:EventEmitter<any> = new EventEmitter()

    @Input() public currentUser:any
    @Input() public members: any[];

    constructor(public navCtrl: NavController,
        public translateService: TranslateService) {
        this.translateService.setDefaultLang('pt-br');

    }

    //Abre uma nova página de profile
    goToProfile($user:any) {
        
        /** Bloquear a visualização de usuários inativados */
        if($user.status != undefined && $user.status == 1){
            return;
        }

        //Redirecionar para página de usuário
        this.navCtrl.push('Profile', {
            user_id: $user.ID
        });
    }
}