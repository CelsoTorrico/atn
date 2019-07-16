import { MemberModule } from './../components/member/member.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module'; 
import { ReportPage } from './report';
import { ChartModule } from 'angular2-chartjs';

@NgModule({
  declarations: [
    ReportPage
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    TranslateModule.forChild(),
    MemberModule,
    PipesModule,
    ChartModule
  ],
  exports: [
    ReportPage
  ], 
  entryComponents: [],
  providers: []
})
export class ReportPageModule { }
