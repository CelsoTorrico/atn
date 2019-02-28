import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'search-member',
    template: `
        <ion-row>
            <ion-col>
                <input type="search" placeholder="Encontre alguém" [(ngModel)]="search" class="searchbar-input" />
            </ion-col>
            <ion-col text-left>
                <button ion-button (click)="searchMember($event)">{{ "Pesquisar" | translate }}</button>
            </ion-col>
        </ion-row>        
    `,
    styles: [`
        button{
            margin: 0px;
        }
    `]
})
export class searchField{

    public search:string;

    constructor(
        public navCtrl:NavController,
        public translateService: TranslateService) { 
    
        this.translateService.setDefaultLang('pt-br');

    }

    //Redireciona para página de busca com query
    searchMember($event){
        this.navCtrl.push('SearchPage', {
            display_name: this.search
        }); 
    }

}