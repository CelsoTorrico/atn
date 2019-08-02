import { ProfileTypeStepPage } from './profile-type/profile-type';
import { NgModule } from '@angular/core';
import { SignupStepsService } from './signup-steps.service';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { SignupStepsPage } from './signup-steps';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessStepPage } from './success/success';
import { ConfirmEmailStepPage } from './confirm-email/confirm-email';
import { TagInputModule } from 'ngx-chips';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../providers';

@NgModule({
    imports:[
        IonicPageModule.forChild([ SignupStepsPage, ProfileTypeStepPage, SuccessStepPage, ConfirmEmailStepPage]),
        TranslateModule.forChild(),
        TagInputModule,
        CommonModule,
        ReactiveFormsModule
    ],
    exports:[],
    declarations: [
        SignupStepsPage, ProfileTypeStepPage, SuccessStepPage, ConfirmEmailStepPage 
    ],
    bootstrap: [SignupStepsPage],
    entryComponents: [
        SignupStepsPage, ProfileTypeStepPage, SuccessStepPage, ConfirmEmailStepPage
    ],
    providers:[
        User,
        SignupStepsService
    ],
})

export class SignupStepsModule {} 
