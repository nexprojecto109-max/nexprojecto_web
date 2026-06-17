// ─────────────────────────────────────────────────────────────
// FIREBASE CONFIG
// ─────────────────────────────────────────────────────────────
// Credentials are read from environment variables (.env file) —
// NEVER hardcode them here. This keeps secrets out of the codebase
// and lets you safely commit this file to GitHub.
//
// 🔧 SETUP STEPS:
// 1. In your project root (same level as package.json), create a file
//    named exactly: .env
//
// 2. Paste your Firebase project's credentials into it like this
//    (replace the placeholder values with YOUR real values from the
//    Firebase Console → Project Settings → General → Your apps):
//
//      VITE_FIREBASE_API_KEY=your_api_key_here
//      VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
//      VITE_FIREBASE_PROJECT_ID=your_project_id
//      VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
//      VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
//      VITE_FIREBASE_APP_ID=your_app_id
//
//    IMPORTANT: Vite only exposes env vars prefixed with VITE_ to the
//    frontend — so the prefix is required, don't remove it.
//
// 3. Restart `npm run dev` after creating/editing .env (Vite only
//    reads env files on startup).
//
// 4. For Vercel deployment: go to your Vercel Project → Settings →
//    Environment Variables, and add the same 6 key/value pairs there
//    (Vercel does NOT read your local .env file — you must add them
//    in the dashboard too, for Production/Preview/Development).
//
// 5. In the Firebase Console, also enable:
//      Authentication → Sign-in method → Email/Password → Enable
//      Firestore Database → Create database → Start in production
//        mode (or test mode while developing)
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Helpful warning if .env hasn't been set up yet, instead of a cryptic crash
const missingKeys = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k)
if (missingKeys.length > 0) {
  console.warn(
    `[NexProjecto] Firebase config is missing: ${missingKeys.join(', ')}. ` +
    'Create a .env file in the project root with your Firebase credentials. ' +
    'See src/firebase/config.js for the full setup steps.'
  )
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
