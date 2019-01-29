import { TimelineModule } from '../components/timeline/timeline.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';

@NgModule({
  declarations: [
    PostPage
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
    TranslateModule.forChild(),
    TimelineModule 
  ],
  exports: [
    PostPage
  ]
})
export class PostPageModule { }
