import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnPage } from './learn';
import { LearnContainerModule } from '../components/learn/learn.module';

@NgModule({
  declarations: [
    LearnPage
  ],
  imports: [
    IonicPageModule.forChild(LearnPage),
    TranslateModule.forChild(),
    LearnContainerModule
  ],
  exports: [
    LearnPage
  ]
})
export class LearnModule { }
