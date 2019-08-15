/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */

'use strict';
importScripts('./build/sw-toolbox.js'); 

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets 
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.get('user/self', self.toolbox.networkFirst);
self.toolbox.router.get('login/cookie', self.toolbox.networkOnly);

//Envia notificação ao usuário
self.addEventListener('push', function (event) {

  if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
  }

  const sendNotification = payload => {

      payload = JSON.parse(payload); //Converte string em objeto JSOM
      
      return self.registration.showNotification(payload.title, {
          lang: 'la',
          badge: 'https://atletasnow.com/wp-content/uploads/2019/08/notify-icon.png',
          icon: 'https://atletasnow.com/wp-content/uploads/2019/08/notify-icon.png',
          body: payload.body,
          vibrate: [500, 100, 500],
          data: payload.actions,
          actions: payload.actions
      });
  };

  if (event.data) {
      const message = event.data.text();
      event.waitUntil(sendNotification(message));
  }
  
});