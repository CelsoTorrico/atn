import { ChartModule } from 'angular2-chartjs';
import { ProfileResumeComponent } from './profile.resume.component';
import { NgModule } from "@angular/core";
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
    declarations: [
        ProfileResumeComponent 
      ],
      imports: [
        TranslateModule.forChild(),        
        IonicModule,
        CommonModule,
        PipesModule,
        ChartModule        
      ],
      exports: [ProfileResumeComponent],
      bootstrap: [ProfileResumeComponent],
      entryComponents:[
        ProfileResumeComponent
      ], 
      schemas: [],
      providers: []
})
export class ProfileResumeModule{}