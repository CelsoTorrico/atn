import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'search-member',
    template: `
        <ion-row>
            <ion-col align-self-end> 
                <input type="search" placeholder="{{ input_name | translate }}" [(ngModel)]="search" class="searchbar-input" />
            </ion-col>
            <ion-col col-auto text-left align-self-end>
                <button ion-button icon-only (click)="searchMember($event)">
                    <ion-icon item-end name="search"></ion-icon>
                </button>
            </ion-col>
        </ion-row>        
    `
})
export class searchField{

    public search:string;

    public input_name:string;

    constructor(
        public navCtrl:NavController,
        public translateService: TranslateService) {     
            this.translateService.setDefaultLang('pt-br'); 
    }   

    ngOnInit() {
        this.translateService.get("INPUT_NAME").subscribe((data) => {
            this.input_name = data; 
        }); 
    }   

    //Redireciona para página de busca com query
    searchMember($event){
        this.navCtrl.push('Search', {
            display_name: this.search
        }); 
    }

}