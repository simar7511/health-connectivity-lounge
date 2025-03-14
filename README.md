
# Health Connectivity Platform

A comprehensive platform designed to connect healthcare providers with underserved communities, including undocumented, uninsured, and limited English proficiency individuals.

## Features

- Patient and Provider portals
- Appointment scheduling and management
- Multilingual support (English/Spanish)
- Secure messaging system
- Pediatric intake form
- Symptom checker

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Key Configuration

This application uses server-side API keys for AI services. To configure:

1. Edit the `functions/.env` file with your actual API keys:
   - `OPENAI_API_KEY` for OpenAI services
   - `HUGGING_FACE_TOKEN` for Hugging Face / Llama services

2. Deploy the updated Firebase Functions:
   ```
   cd functions
   npm install
   firebase deploy --only functions
   ```

## Firebase Configuration

The application is configured using the following Firebase settings:

```
VITE_FIREBASE_API_KEY=AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw
VITE_FIREBASE_AUTH_DOMAIN=health-connectivity-01.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=health-connectivity-01
VITE_FIREBASE_STORAGE_BUCKET=health-connectivity-01.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=429069343294
VITE_FIREBASE_APP_ID=1:429069343294:web:943a1998a83e63353c0f6f
VITE_FIREBASE_MEASUREMENT_ID=G-3BVWXWV69Q
```

## Production Deployment

1. Build the project: `npm run build`
2. Deploy to Firebase: `firebase deploy`

## Target Audience
Marginalized groups, including those who are undocumented, uninsured, and have limited English proficiency, face significant barriers to accessing healthcare. This platform aims to address these challenges.
