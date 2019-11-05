import { TagInputModule } from 'ngx-chips';
import { ProfileRequired } from './../pages/profile/profile-required.component';
import { ZipcodeService } from './../providers/zipcode/zipcode';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ng2-cookies';
import { DashboardPageModule } from './../pages/dashboard/dashboard.module';
import { loadNewPage } from './../providers/load-new-page/load-new-page';
import { SignupStepsModule } from './../pages/signup-steps/signup-steps.module';
import { LoginPageModule } from './../pages/login/login.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, enableProdMode } from '@angular/core'; 
import { IonicStorageModule, Storage } from '@ionic/storage';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule, DeepLinkConfig, Transition } from 'ionic-angular';
import { Settings, Api, Cookie } from '../providers';
import { MyApp } from './app.component'; 
import { MenuPageModule } from '../pages/components/menu/menu.module';
import { BrazilStates } from '../providers/useful/states';
import { PipesModule } from '../pipes/pipes.module';
import { ChartModule } from 'angular2-chartjs';
import { PushNotifyService } from '../providers/notification/notification'; 
import { BrowserModule } from '@angular/platform-browser'; 
import { LoginPage } from '../pages/login/login';
import { SignupStepsPage } from '../pages/signup-steps/signup-steps';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { FavoritePage } from '../pages/favorite/favorite';
import { LearnPage } from '../pages/learn/learn';
import { ChatPage } from '../pages/chat/chat';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { PostPage } from '../pages/post/post';
import { GenderList } from '../providers/gender/gender';
import { SportList } from '../providers/sport/sport';
import { ClubList } from '../providers/clubs/clubs';
import { CalendarList } from '../providers/calendartypes/calendar';
import { profileTypeList } from '../providers/profiletypes/profiletypes';
import { VisibilityList } from '../providers/visibility/visibility';
import { TranslateChar } from '../providers/useful/translateChar';

//Habilita Angular em produção
enableProdMode();

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

const deeplinkconfig:DeepLinkConfig = {
  links: [
    {
      name: 'Login',
      segment: 'login',
      component: LoginPage, 
      priority: 'high' 
    },
    {
      name: 'Register', 
      segment: 'register',
      defaultHistory: ['Login'],          
      component: SignupStepsPage,  
      priority: 'high' 
    },
    {
      name: 'ConfirmEmail', 
      segment: 'register/:step/:email/:token',
      defaultHistory: ['Login'],          
      component: SignupStepsPage,  
      priority: 'high' 
    },
    {
      name: 'Dashboard',
      segment: 'dashboard',
      component: DashboardPage,
      priority: 'high'
    },
    {
      name: 'Timeline',
      segment: 'dashboard/timeline/:post_id',
      component: DashboardPage,
    },
    {
      name: 'Favorite',
      segment: 'favorite',
      defaultHistory: ['Dashboard'],
      component: FavoritePage
    },
    {
      name: 'Learn',
      segment: 'learn',
      defaultHistory: ['Dashboard'],
      component: LearnPage
    },
    {
      name: 'Chat',
      segment: 'chat',
      defaultHistory: ['Dashboard'],
      component: ChatPage
    },
    {
      name: 'Search',
      segment: 'search',
      defaultHistory: ['Dashboard'],
      component: SearchPage
    },
    {
      name: 'Settings',
      segment: 'settings',
      defaultHistory: ['Dashboard'],
      component: SettingsPage
    },
    {
      name: 'Profile',
      segment: 'profile/:user_id/:user_login',
      defaultHistory: ['Dashboard'],
      component: ProfilePage
    },
    {
      name: 'Post', 
      segment: 'post/:post_id',
      defaultHistory: ['Learn'], 
      component: PostPage
    }
  ]
}

@NgModule({
  declarations: [
    MyApp, ProfileRequired
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader), 
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, { 
      mode: 'md',
      preloadModules: true,
    }, deeplinkconfig),
    IonicPageModule.forChild(MyApp),     
    IonicStorageModule.forRoot(), 
    MenuPageModule,
    LoginPageModule,
    SignupStepsModule,
    DashboardPageModule,    
    PipesModule,
    ChartModule,
    TagInputModule     
  ],
  exports: [],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfileRequired
  ],
  providers: [
    Api,
    loadNewPage,
    TranslateChar,
    BrazilStates,
    GenderList,
    profileTypeList,
    SportList,
    ClubList, 
    CalendarList,
    VisibilityList,
    Cookie,
    CookieService,
    ZipcodeService,
    PushNotifyService,
    { provide: Settings, useClass: IonicErrorHandler, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },

  ]
})
export class AppModule { }
