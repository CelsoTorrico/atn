// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  /*production: false,
  apiOrigin: 'http://localhost/desenvolvimento/atletasNOW/app-front/www',
  apiUrl: 'http://localhost/desenvolvimento/atletasNOW/app/public',
  socketIO: 'http://localhost:8890',
  socketSecure: false,
  vapidPublicKey: 'BDkRxalAC1kPJFPYiRG-MFebPyUNHDWfDHm4T0OWOWWzWNKL9n6IIqfRHszU-1nIbE0_ZdUxXUpm2nus0OHeDe0',
  vapidPrivateKey: 'mixFQhh6Q8VH-BrhQdkPSBMGhmYh1-Q9SyoXRP7LTxM'*/

  /* Development */
  
  production: true,
  apiOrigin: 'https://developing.atletasnow.com/app-atletasnow-front/',
  apiUrl: 'https://developing.atletasnow.com/atletasNOW/app/public/',
  socketIO: 'https://developing.atletasnow.com:8890',
  socketSecure: true,
  vapidPublicKey: 'BDkRxalAC1kPJFPYiRG-MFebPyUNHDWfDHm4T0OWOWWzWNKL9n6IIqfRHszU-1nIbE0_ZdUxXUpm2nus0OHeDe0',
  vapidPrivateKey: 'mixFQhh6Q8VH-BrhQdkPSBMGhmYh1-Q9SyoXRP7LTxM'

  /**/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
