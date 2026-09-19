// Lazy client-side Firebase initialization.
// All helpers no-op (return null/false) until the public Firebase
// environment variables are configured in .env.local.

import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

export const FIREBASE_CONFIG: Partial<FirebaseOptions> = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.authDomain &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.appId
  );
}

let appInstance: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!appInstance) {
    appInstance = initializeApp(FIREBASE_CONFIG as FirebaseOptions);
  }
  return appInstance;
}