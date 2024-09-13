import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';


// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCsjBv9g5Gwu94TXJm8DrXe5htgjFz_mEI",
  authDomain: "ring-of-fire-83bdd.firebaseapp.com",
  projectId: "ring-of-fire-83bdd",
  storageBucket: "ring-of-fire-83bdd.appspot.com",
  messagingSenderId: "617093114838",
  appId: "1:617093114838:web:45b4c59248b91e04c51277",
  measurementId: "G-HHKS6D8VX4"
};

console.log('Firebase Configuration:', firebaseConfig);


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      console.log('Firebase App Initialized:', app);
      return app;
    }),
    provideFirestore(() => getFirestore())
  ]
};
