import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyCLOho-tl6x0UC3kqVzp5MZ07W6RT6hs6E",
  authDomain: "pokefusion-challenge.firebaseapp.com",
  projectId: "pokefusion-challenge",
  storageBucket: "pokefusion-challenge.firebasestorage.app",
  messagingSenderId: "458189777872",
  appId: "1:458189777872:web:9e7b76ea6b95db1e6ba7d5",
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ]
};
