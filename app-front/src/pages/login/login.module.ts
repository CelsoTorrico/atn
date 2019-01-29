import { LoginService } from './login.service';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { LoginPage } from './login';
import { SignupStepsModule } from '../signup-steps/signup-steps.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  //Declara apenas components, directives e pipes do módulo
  declarations: [
    LoginPage
  ],
  exports:[
    //LoginPage
  ],
  //Importa 'apenas' módulos para este
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild(), 
    FormsModule,
    SignupStepsModule
  ],
  //Inicializa componente enviando para index.html
  bootstrap: [],
  entryComponents:[
    LoginPage
  ],
  //Declarando services e etc
  providers:[
    LoginService 
  ]
})
export class LoginPageModule { }
