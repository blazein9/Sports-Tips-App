# Sports Tips App

A simple React + Firebase starter app for generating random sports tips.

## What it includes

- Authentication with Google, Facebook, or email/password
- Category selection for Football, Basketball, and Tennis
- Tip filtering by value range
- Random tip generation from local data
- Easy extension to add more sports or connect to Google Sheets / a database

## Setup

1. Install dependencies:

   npm install

2. Add Firebase credentials in a `.env` file at the project root:

   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

3. Run the app:

   npm run dev

## How to extend it

- Add new categories and tips in `src/data/tips.ts`
- Replace local tip data with a Google Sheets connection or an external database
- Customize the range filter logic in `src/App.tsx`
- Use Firebase console to enable Google and Facebook authentication
