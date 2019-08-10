import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Settings, User } from '../../providers';
import { DashboardPage } from '../dashboard/dashboard';
import { PushNotifyService } from '../../providers/notification/notification';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage({
  segment: 'settings',
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  $errors: string;

  constructor(
    public user: User,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public push: PushNotifyService) {

  }

  ionViewDidLoad() {
    /** Verifica se usuário já esta logado anteriormente na plataforma */
    this.user.isLoggedUser().then((resp) => {
      //Redireciona para a página de Login
      if (!resp) {
        this.navCtrl.setRoot('Login');
      }
    });
  }

  ngOnInit() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
    this._buildForm();
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    //this.form = this.formBuilder.group({});


    /*this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;
      this._buildForm();
    });*/
  }

  _buildForm() {

    let group: any = {
      //defaultLang   : [this.options.defaultLang],
      user_pass: '',
      confirm_pass: ''
    };

    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    /*this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });*/

    this.settingsReady = true;

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

        this.form.reset();

      } else {
        this.$errors = res.error.user_pass;
      }

    }, err => {
      console.error('ERROR', err);
    });

  }

  // Adicionar/Permissão permissão para notificações via browser
  enableDesktopNotification() {
    this.push.requestDesktopNotificationPermission();
  }

  //Abre uma nova página
  backButton() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('Dashboard');
    }
  }

}
