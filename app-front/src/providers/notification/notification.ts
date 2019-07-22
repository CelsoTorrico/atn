import { ToastController } from 'ionic-angular';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class PushNotifyService {

    //Web Push
    webpush = require('web-push');

    convertedKey64: any;

    constructor(private api: Api, private toastCtrl: ToastController) {
        
        this.webpush.setVapidDetails(
            environment.apiUrl,
            environment.vapidPublicKey,
            environment.vapidPrivateKey
        );

        this.convertedKey64 = this.urlBase64ToUint8Array(environment.vapidPublicKey);
    }

    isSubscribed(): boolean {
        // When the Service Worker is ready, enable the UI (button),
        // and see if we already have a subscription set up.

        let response: any;

        navigator.serviceWorker.ready
            .then(function (registration) {
                return registration.pushManager.getSubscription();
            }).then(function (subscription) {
                if (subscription) {
                    response = true;
                } else {
                    response = false;
                }
            });

        return response;
    }

    // Adicionar/Permissão permissão para notificações via browser
    public requestDesktopNotificationPermission() {
        if (this.isSubscribed()) {
            //Remover notificações
            this.unsubscribe();
        } else {
            //Adicionar notificações
            this.subscribe();
        }
    }

    // Get the `registration` from service worker and create a new
    // subscription using `registration.pushManager.subscribe`. Then
    // register received new subscription by sending a POST request with
    // the subscription to the server.
    // @refer https://serviceworke.rs/push-subscription-management_demo.html
    private subscribe() {

        let pubKey = this.convertedKey64;

        let api = this.api;

        let alert = this.toastCtrl.create({
            message: "Você autorizou o envio de notificações para seu dispositivo.",
            duration: 3000,
            position: 'bottom'
        });

        navigator.serviceWorker.ready
            .then(async function (registration) {
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: pubKey
                });
            }).then(function (subscription) {

                let authorize = api.post('user/settings/push-authorize', { subscription: subscription });

                return authorize.subscribe((resp) => {
                    alert.present();                    
                });

            }).then();
    }

    // Get existing subscription from service worker, unsubscribe
    // (`subscription.unsubscribe()`) and unregister it in the server with
    // a POST request to stop sending push messages to
    // unexisting endpoint.
    private unsubscribe() {
        
        let api = this.api; 

        let alert = this.toastCtrl.create({
            message: "Você desatourizou o envio de notificações para seu dispositivo.",
            duration: 3000,
            position: 'bottom'
        });                     

        navigator.serviceWorker.ready
            .then(function (registration) {
                return registration.pushManager.getSubscription();
            }).then(function (subscription) {
                return subscription.unsubscribe()
                    .then(function () {
                        
                        let disauthorize = api.post('user/settings/push-disauthorize', { subscription: subscription });

                        return disauthorize.subscribe((resp) => { 
                            alert.present();
                        });

                    });
            }).then(); 
    }

    urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/'); 

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

}
