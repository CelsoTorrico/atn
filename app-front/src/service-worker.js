/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */

'use strict';
importScripts('./build/sw-toolbox.js'); 

/*self.toolbox.options.cache = {
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
);*/

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;

//Envia notificação ao usuário
self.addEventListener('push', function (event) {

  if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
  }

  const sendNotification = payload => {

      payload = JSON.parse(payload); //Converte string em objeto JSOM
      
      return self.registration.showNotification(payload.title, {
          lang: 'la',
          badge: 'https://atletasnow.com/wp-content/themes/nova_atletasnow/assets/images/logo-cor-2.png',
          icon: 'https://atletasnow.com/wp-content/themes/nova_atletasnow/assets/images/logo-cor-2.png',
          body: payload.body,
          vibrate: [500, 100, 500],
          click_action: payload.click_action
      });
  };

  if (event.data) {
      const message = event.data.text();
      event.waitUntil(sendNotification(message));
  }
  
});