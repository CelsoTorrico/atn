import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Settings, User } from '../../providers';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  $errors:string;

  constructor(
    public user: User,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService) {
  }

  _buildForm() {
    
    let group: any = {
      defaultLang   : [this.options.defaultLang],
      user_pass     : '',
      confirm_pass  : ''
    };

    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });

  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  //Ao Enviar formulário
  submitForm(event) {
    
    event.preventDefault();

    let observable = this.user.setNewPassword(this.form.value);

    observable.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success != undefined) {

        //Exibe mensagem de cadastro
        let message = this.toastCtrl.create({ 
          message: res.success.user_pass, 
          position: 'bottom',
          duration: 2000
        });
        message.present();

      } else {
        this.$errors = res.error.user_pass;
      }

    }, err => {
      console.error('ERROR', err);
    });

  }

  //Abre uma nova página
  backButton() {
    if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
    } else {
        this.navCtrl.setRoot(DashboardPage);
    }        
  }
  
}
