import { SuccessStepModule } from './success/success.module';
import { ProfileTypeStepModule } from './profile-type/profile-type.module';
import { NgModule } from '@angular/core';
import { SignupStepsService } from './signup-steps.service';
import { IonicPageModule } from 'ionic-angular';
import { SignupStepsPage } from './signup-steps';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports:[
        IonicPageModule.forChild([SignupStepsPage]),
        TranslateModule.forChild(),
        ProfileTypeStepModule, 
        SuccessStepModule
    ],
    exports:[],
    declarations: [
        SignupStepsPage
    ],
    bootstrap:[],
    entryComponents: [
        SignupStepsPage
    ],
    providers:[
        SignupStepsService
    ],
})

export class SignupStepsModule {} 
