import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'search-member',
    template: `
        <ion-searchbar [(ngModel)]="search" (keyup)="searchMember($event)"></ion-searchbar>              
    `,
    styles: [`

    `]
})
export class searchField{

    public search:string;

    constructor(public navCtrl:NavController){

    }

    //Redireciona para página de busca com query
    searchMember($event){
        if ($event.code != 'Enter') { 
            return;
        }
        this.navCtrl.push('SearchPage', {
            display_name: this.search
        }); 
    }

}