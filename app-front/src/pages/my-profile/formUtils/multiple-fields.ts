import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'multiple-fields',
    template: `
        <ion-row class="multiple-new-item">
            <ion-col *ngFor="let f of listArray; let i = index">
            <ion-item>
                <ion-input type="text" [(ngModel)]="fieldToAdd[i]" [ngModelOptions]="{standalone:true}" placeholder="{{f | translate }}"></ion-input>
            </ion-item>
            </ion-col>
            <ion-col col-md-2>
            <ion-item>
                <button ion-button full item-end (click)="dismiss()">{{ "ADD" | translate }}</button>
            </ion-item>                  
            </ion-col>
        </ion-row>
    `
})
export class MultipleFields {

    public modelToFill: string;

    public listArray: string[];

    public fieldToAdd: any = ['', '', ''];

    constructor(public translate: TranslateService, public viewCtrl: ViewController, public params: NavParams) {

        //Atribui lista de dados para serem inseridos
        this.listArray = this.params.get('list');
    }

    //Função que inicializa
    ngOnInit() {

    }

    dismiss() {
        let data = { [this.modelToFill]: this.fieldToAdd };
        this.viewCtrl.dismiss(data);
    }

}
