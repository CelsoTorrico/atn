import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../../../providers';

@Component({
    selector: 'member-current-user',
    template: `
            <button ion-item (click)="openMenu($event)">
                
                <h2>Olá, <strong>{{ member.display_name | stringTitlecaseSpecialChars }}</strong></h2>

                <ion-avatar class="btn-cursor img-center" item-end> 
                    
                    <img *ngIf="member.metadata.profile_img.value, else elseBlock" 
                    [src]="member.metadata.profile_img.value" />
                    <ng-template #elseBlock>
                        <img src="assets/img/user.png" [title]="member.display_name" />
                    </ng-template>

                    <div class="popup popover-menu">
                        <member-current-menu></member-current-menu> 
                    </div>
                
                </ion-avatar>

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
        content: " ";
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

    @Input() public member:any = {
        ID: "",
        display_name: "",
        metadata: {
            profile_img:{
                value: ""
            }
        }
    };

    public pageElement:any;
    public notifyElement:any;

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public translateService: TranslateService) { 
            this.translateService.setDefaultLang('pt-br');
        }


    ngOnInit() {
        //Adicionar popup ao elemento para sobrepor header
        this.pageElement = document.getElementsByTagName('page-dashboard'); 
        let $index = this.pageElement.length - 1;
        this.pageElement[$index].appendChild(this.pageElement[$index].querySelector('.popover-menu')); 
        this.notifyElement = document.getElementsByClassName('popover-menu');
    }

    //Abrir popup notificação
    openMenu($event) {

        $event.preventDefault();

        let popup   = this.notifyElement[0]; 
        let page    = document.querySelector('.page-dashboard');

        //Se tamanho da tela menor que definido, não exibir menu
        //Define a posicao do elemento popup 
        if (window.innerWidth < 576) {
           return;
        } 

        popup.style.left = ($event.pageX - 250) + 'px'; 

        //Adicionar classe para visualizar
        popup.classList.toggle('open');
        
        //Ao clicar fora da área de notificação >> fechar    
        page.addEventListener('click', function(ev){
            ev.preventDefault(); 
            popup.classList.remove('open'); 
        });  

    }

}