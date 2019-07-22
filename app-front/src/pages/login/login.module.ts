import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { SignupStepsModule } from '../signup-steps/signup-steps.module';
import { FormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password.component';

@NgModule({
  //Declara apenas components, directives e pipes do módulo
  declarations: [
    LoginPage, 
    ForgetPasswordComponent
  ],
  exports:[
    //LoginPage
  ],
  //Importa 'apenas' módulos para este
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild(), 
    CommonModule,
    FormsModule,
    SignupStepsModule
  ],
  //Inicializa componente enviando para index.html
  bootstrap: [],
  entryComponents:[
    LoginPage,
    ForgetPasswordComponent 
  ],
  //Declarando services e etc
  providers:[]
})
export class LoginPageModule { }
