// Firebase client SDK initialisation — singleton pattern for Next.js
// Only runs on the CLIENT side (browser)

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent duplicate initialisation during Next.js hot reload
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);

// Critical Fix: Bypass strict reCAPTCHA / IP Blocks entirely during Localhost dev.
// This allows test numbers (like your Dad's and yours) to connect instantly without throttling.
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  auth.settings.appVerificationDisabledForTesting = true;
}

export default app;
