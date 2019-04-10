import { SuccessStep } from './success';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicApp } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports:[
        IonicPageModule.forChild(SuccessStep),
        TranslateModule.forChild() 
    ],
    declarations: [
       SuccessStep
    ],
    bootstrap: [IonicApp],    
    entryComponents: [
        SuccessStep
    ],
    providers:[
        
    ],
})

export class SuccessStepModule {} 
