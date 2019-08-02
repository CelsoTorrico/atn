import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Nav, NavController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'member-suggestion',
    template: `
            <ion-card class="btn-cursor" ion-item (click)="goToProfile(memberModel.ID, $event)">

                <ion-avatar class="btn-cursor" item-start>
                    <img *ngIf="memberModel.profile_img.value, else elseBlock" [src]="memberModel.profile_img.value" />
                    <ng-template #elseBlock>
                        <img src="assets/img/user.png" [title]="memberModel.display_name" />
                    </ng-template>
                </ion-avatar>

                <ion-label>{{ memberModel.display_name | stringTitlecaseSpecialChars }}</ion-label>                

            </ion-card>                       
    `,
    styles: [`
    ion-item{
        text-align: center;
    }
    
    ion-card{
        background: linear-gradient(to top, transparent, #ce4f50);
        border: 0px;
        padding: 10px 15px;
        text-align: center;
        display:block;
        width: calc(50% - 2px);
        margin-right: 2px;
        float: left;
        font-size: 1.2rem;
    }
    
    ion-card ion-label{
        color: #fff !important;
    }

    ion-avatar{    
        margin:8px 0px !important;
        border-radius: 50%;
        padding-top: 10px 0px;
        overflow: hidden;
    }

    img{
        max-width: 100px;
        width: 100px;
        height: 100px;
        display: block;
        margin: auto;
      }
    `]
})
export class MemberSuggestion {

    @Input() public member: any;

    memberModel: any = {
        ID: null,
        profile_img: {
            value: null
        },
        display_name: null
    }

    constructor(public navCtrl: NavController,
        public translateService: TranslateService) { 
            this.translateService.setDefaultLang('pt-br'); }

    ngOnInit() {
        //Atribuindo dados ao modelo
        this.memberModel.ID = this.member.ID;
        this.memberModel.display_name = this.member.display_name;

        if (this.member.profile_img != undefined) {
            this.memberModel.profile_img = this.member.profile_img;
        }
    }

    //Abre uma nova página de profile
    goToProfile($user_id: number) {
        this.navCtrl.push('Profile', { 
            user_id: $user_id
        });
    }
}