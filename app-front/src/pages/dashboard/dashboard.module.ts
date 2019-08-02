import { SearchFieldsModule } from './../components/search/search.module';
import { MenuPageModule } from './../components/menu/menu.module';
import { DashboardPage } from './dashboard';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { TimelineModule } from '../components/timeline/timeline.module';
import { MemberModule } from '../components/member/member.module';
import { NotifyModule } from '../components/notify/notify.module';
import { SearchPageModule } from '../search/search.module';
import { ProfilePageModule } from '../profile/profile.module';
import { FavoritePageModule } from '../favorite/favorite.module';
import { LearnModule } from '../learn/learn.module';
import { PostPageModule } from '../post/post.module';
import { ChatPageModule } from '../chat/chat.module';
import { ReportPageModule } from '../report/report.module';
import { SettingsPageModule } from '../settings/settings.module';
import { MyProfilePageModule } from '../my-profile/my-profile.module';
import { User } from '../../providers';
import { VisibilityList } from '../../providers/visibility/visibility';
import { DashboardLastActivityService } from './dashboardactivity.service';

@NgModule({
  //Declara apenas components, directives e pipes do módulo
  declarations: [
    DashboardPage
  ],
  exports:[],
  //Importa 'apenas' módulos para este
  imports: [
    IonicPageModule.forChild(DashboardPage),
    TranslateModule.forChild(),
    SearchPageModule,
    ProfilePageModule,
    MyProfilePageModule,
    FavoritePageModule, 
    LearnModule,
    PostPageModule,
    ChatPageModule,
    ReportPageModule,
    SettingsPageModule,
    MenuPageModule, 
    SearchFieldsModule,
    TimelineModule,
    NotifyModule,
    MemberModule
  ],
  //Inicializa componente enviando para index.html
  bootstrap: [],
  entryComponents:[
    DashboardPage
  ],
  //Declarando services e etc
  providers:[
    User,
    VisibilityList,
    DashboardLastActivityService
  ]
})
export class DashboardPageModule { }
