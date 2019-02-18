import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../../../providers';

@Component({
    selector: 'member-current-user',
    template: `
            <button ion-item>
                <h2>Olá, <strong>{{ member.display_name | titlecase }}</strong></h2>

                <ion-avatar class="btn-cursor" item-end (click)="openMenu($event)">
                    <img *ngIf="member.profile_img, else elseBlock" 
                    [src]="member.profile_img.value" />
                    <ng-template #elseBlock>
                        <img src="assets/img/user.png" [title]="member.display_name" />
                    </ng-template>
                </ion-avatar>

                <div class="popup popover-menu">
                    <ul class="nomargin-nopadding">
                        <li *ngFor="let nav of menuItems | mapToIterable ">
                            <a class="btn-cursor" (click)="goToPage(nav.val)">{{ nav.key }}</a>
                        </li>
                    </ul>
                </div>
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
        border-radius: 50%;
        position: relative;
    }

    ion-avatar::after{
        position: absolute;
        content: "v";
        right: -10px;
        color: $fff;
        margin-left: auto;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 100;
    }
    `]
})
export class MemberUser { 

    @Input() public member: any;

    menuItems:any = {
         "MY_PROFILE"  :  "ProfilePage",
         "FAVORITE"    :  "FavoritePage",
         "LEARN"       :  "LearnPage",
         "MESSAGES"    :  "ChatPage",
         "SEARCH"      :  "SearchPage",
         "FAQ"         :  "",
         "SUPPORT"     :  "",
         "LOGOUT"     :   "",
    }

    constructor(public user:User, public navCtrl: NavController) {

    }

    //Abrir popup notificação
    openMenu($event) {

        $event.preventDefault();

        //Adiciona ao elemento pai
        let page = document.getElementsByTagName('page-dashboard');
        let find = page[0].querySelector('.popover-menu');
        let popup: any = find;

        //Define a posicao do elemento popup
        popup.style.left = ($event.pageX - 250) + 'px';
        //popup.style.top  = ($event.pageY + 15) + 'px';

        //Adicionar popup ao elemento para sobrepor header
        page[0].appendChild(popup);

        setTimeout(function () {
            popup.classList.add('open');
        }, 300)

        //Ao clicar fora da área de notificação >> fechar
        popup.addEventListener('mouseout', function () {
            page[0].addEventListener('click', function (ev) {
                if (ev.target != popup.children) {
                    popup.classList.remove('open');
                }
            });
        });

    }

    //Abre uma nova página de profile
    goToPage($page:string) {
        this.navCtrl.push($page, {user_id: null});
    }
}