import { FavoritePageModule } from './../pages/favorite/favorite.module';
import { ProfilePageModule } from './../pages/profile/profile.module';
import { CookieService } from 'ng2-cookies';
import { DashboardPageModule } from './../pages/dashboard/dashboard.module';
import { loadNewPage } from './../providers/load-new-page/load-new-page';
import { SignupStepsModule } from './../pages/signup-steps/signup-steps.module';
import { LoginPageModule } from './../pages/login/login.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings, User, Api, Cookie } from '../providers';
import { MyApp } from './app.component';
import { MenuPageModule } from '../pages/components/menu/menu.module';
import { BrazilStates } from '../providers/useful/states';
import { PipesModule } from '../pipes/pipes.module';
import { MyProfilePageModule } from '../pages/my-profile/my-profile.module';
import { ChartModule } from 'angular2-chartjs';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { FavoritePage } from '../pages/favorite/favorite';
import { ChatPage } from '../pages/chat/chat';
import { LearnPage } from '../pages/learn/learn';
import { SearchPageModule } from '../pages/search/search.module';
import { LearnModule } from '../pages/learn/learn.module';
import { ChatPageModule } from '../pages/chat/chat.module';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { SignupStepsPage } from '../pages/signup-steps/signup-steps';


//Habilita Angular em produção
//enableProdMode();

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    defaultLang: 'pt-br'
  });
}

const appRoutes: Routes = [
  { path: 'login',      component: LoginPage },
  { path: 'dashboard',  component: DashboardPage },
  { path: 'search',     component: SearchPage },
  { path: 'favorite',   component: FavoritePage },
  { path: 'learn',      component: LearnPage },
  { path: 'chat',       component: ChatPage },
  { path: 'favorite',   component: FavoritePage },
  { path: 'profile',    component: ProfilePage },  
  { path: 'settings',   component: SettingsPage },
  { path: 'signup-steps', component: SignupStepsPage },  
  { path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- true == debugging purposes only
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      mode: 'md' 
    }),
    IonicStorageModule.forRoot(),  
    MenuPageModule, 
    LoginPageModule,
    SignupStepsModule, 
    DashboardPageModule,
    MyProfilePageModule,
    SearchPageModule,
    ProfilePageModule,
    FavoritePageModule,
    LearnModule,
    ChatPageModule,
    SettingsPageModule,
    PipesModule,
    ChartModule
  ],
  exports: [],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    User,
    Camera,
    InAppBrowser,
    loadNewPage,
    BrazilStates,
    Cookie,
    CookieService,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    //{ provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
