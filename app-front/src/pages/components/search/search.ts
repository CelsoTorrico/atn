import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'search-member',
    template: `
        <ion-row>
            <ion-col>
                <input type="search" placeholder="Encontre alguém" [(ngModel)]="search" class="searchbar-input" />
            </ion-col>
            <ion-col>
                <button ion-button (click)="searchMember($event)">{{ "Pesquisar" | translate }}</button>
            </ion-col>
        </ion-row>        
    `,
    styles: [``]
})
export class searchField{

    public search:string;

    constructor(public navCtrl:NavController){

    }

    //Redireciona para página de busca com query
    searchMember($event){
        this.navCtrl.push('SearchPage', {
            display_name: this.search
        }); 
    }

}