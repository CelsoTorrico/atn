import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileType } from './profile-type';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicApp } from 'ionic-angular';
// Módulo para autocomplete tag input  
import { TagInputModule } from 'ngx-chips';


@NgModule({
    imports:[
        IonicPageModule.forChild([ProfileType]),
        TranslateModule.forChild(),
        TagInputModule,
        FormsModule,
        ReactiveFormsModule
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
