import { TranslateModule } from '@ngx-translate/core';
import { ProfileType } from './profile-type';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicApp } from 'ionic-angular';
// Módulo para autocomplete tag input  
import {RlTagInputModule} from 'angular2-tag-input';

@NgModule({
    imports:[
        IonicPageModule.forChild([ProfileType]),
        TranslateModule.forChild(),
        RlTagInputModule  
    ],
    declarations: [
        ProfileType
    ],
    bootstrap: [IonicApp],    
    entryComponents: [
        ProfileType
    ],
    providers:[
        
    ],
})

export class ProfileTypeStepModule {} 
