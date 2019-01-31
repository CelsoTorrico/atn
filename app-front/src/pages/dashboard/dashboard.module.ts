import { FooterAppModule } from './../components/footer/footer.module';
import { SearchFieldsModule } from './../components/search/search.module';
import { MenuPageModule } from './../components/menu/menu.module';
import { DashboardPage } from './dashboard';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { TimelineModule } from '../components/timeline/timeline.module';
import { MemberModule } from '../components/member/member.module';

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
    MenuPageModule, 
    SearchFieldsModule,
    TimelineModule,
    MemberModule,
  ],
  //Inicializa componente enviando para index.html
  bootstrap: [],
  entryComponents:[
    DashboardPage
  ],
  //Declarando services e etc
  providers:[]
})
export class DashboardPageModule { }
