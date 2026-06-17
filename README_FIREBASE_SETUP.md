# Firebase Integration — Setup Guide

This project now uses **Firebase Authentication** (Email/Password) for
login/signup, and **Firestore** to store users, orders, reviews, contact
messages, and consultations. Project catalog data and website analytics
(page views/clicks) remain in browser localStorage as before.

## 1. Enable Firebase services

In the [Firebase Console](https://console.firebase.google.com), open your
project:

1. **Authentication** → Sign-in method → enable **Email/Password**.
2. **Firestore Database** → Create database → start in **production mode**
   (the security rules below handle access control).

## 2. Add your credentials

1. Copy `.env.example` to a new file named `.env` (same folder as
   `package.json`).
2. Fill in the 6 values from: Project Settings (gear icon) → General →
   "Your apps" → select your web app → SDK setup and configuration → Config.
3. Restart `npm run dev` after saving `.env`.

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**Never commit `.env` to GitHub** — it's already in `.gitignore`.

## 3. Apply Firestore security rules

Open `firestore.rules` in this project, copy the whole contents, then in
Firebase Console → Firestore Database → **Rules** tab → paste → **Publish**.

These rules ensure:
- Users can only read/edit their own profile (and can't make themselves
  admin).
- Anyone can submit contact messages and consultation bookings (no login
  required for those forms).
- Only signed-in users can place orders / write reviews, and only for
  themselves.
- Only admins can mark orders as paid, change consultation status, or see
  all users/orders/messages.

## 4. Create your first Admin account

There's no hardcoded admin login anymore (for security). To make yourself
an admin:

1. Register a normal account on the live website.
2. Firebase Console → Firestore Database → `users` collection → find your
   document (it will match your email).
3. Edit the `role` field: change `"user"` → `"admin"`.
4. Log out and log back in on the website — you'll now be redirected to
   `/admin` and see the Admin Panel link.

## 5. Deploying to Vercel

Firebase credentials must also be added in Vercel (it does not read your
local `.env` file):

1. Vercel Dashboard → your project → **Settings** → **Environment
   Variables**.
2. Add all 6 `VITE_FIREBASE_...` keys with the same values as your `.env`.
3. Apply to Production, Preview, and Development environments.
4. Redeploy.

## What's stored where

| Data                          | Storage                          |
|--------------------------------|-----------------------------------|
| User accounts (auth)           | Firebase Authentication          |
| User profile (name, role, purchased projects) | Firestore `users` collection |
| Orders                         | Firestore `orders` collection    |
| Reviews                        | Firestore `reviews` collection   |
| Contact form messages          | Firestore `messages` collection  |
| Consultation bookings          | Firestore `consultations` collection |
| Project catalog (seed data)    | Browser localStorage             |
| Analytics (page views, clicks) | Browser localStorage (per-device)|

## Notes

- Since analytics stay in localStorage, the **Admin → Analytics** page only
  shows activity from whichever browser/device the admin is using — it's
  not a site-wide analytics tool. For real cross-visitor analytics once
  live, consider adding Google Analytics or Plausible.
- Firestore's free (Spark) plan includes 50K reads / 20K writes / 20K
  deletes per day — comfortably enough for a small-to-medium student
  project marketplace.
