
# Health Connectivity Platform: Safe Haven Virtual Pediatric Clinic

A comprehensive platform designed to connect healthcare providers with underserved communities in rural Washington, with a focus on pediatric care for children and adolescents.

## Project Overview

This project is part of the Scaling Rural Healthcare with AI and LLMs initiative at University of Washington. The goal is to develop a virtual pediatric healthcare clinic leveraging AI and Large Language Models (LLMs) to improve access to medical services for children and adolescents in rural Washington, particularly in Adams County. 

By integrating AI-driven intake systems, bilingual virtual consultations, and community-based outreach, the Safe Haven Virtual Pediatric Clinic aims to bridge healthcare gaps for low-income, uninsured, and Hispanic migrant families while enhancing patient engagement and accessibility.

## Location & Healthcare Focus
* **Rural Area:** Adams County, Washington
* **Target Healthcare Issues:** Pediatric Care
* **User Groups:** Rural pediatric patients and healthcare providers

## Tech Stack

### Frontend
- **Framework:** React with TypeScript
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts & Visualization:** Recharts
- **Form Handling:** React Hook Form with Zod validation

### Backend
- **Cloud Platform:** Firebase
- **Database:** Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Cloud Functions:** Firebase Functions
- **Messaging:** Twilio SMS & WhatsApp integration

### AI & Language Services
- **LLM Integration:** OpenAI, Hugging Face (Llama models)
- **Multilingual Support:** English/Spanish translation
- **Voice Recognition:** React Speech Recognition

### Development
- **Build Tool:** Vite
- **Package Manager:** npm
- **Linting & Formatting:** ESLint

## Features

- Patient and Provider portals
- Appointment scheduling and management
- Multilingual support (English/Spanish)
- Secure messaging system
- Pediatric intake form
- Symptom checker

## User Testing Summary

### Patient-Side Onboarding:
- Users found the website simple, accessible, and intuitive, with effective color guidance.
- Anonymity was well handled.
- Patients raised concerns about tracking their medical history for future visits, highlighting the absence of a patient portal.

### Provider-Side Onboarding:
- The messaging system may become overwhelming if patients frequently ask minor health-related questions.
- Suggested AI integration to handle routine inquiries.

### Action Taken:
- Developed an AI Health Assistant to address common pediatric questions (e.g., colds, vaccines, development).
- Added Spanish translation for accessibility.
- AI defers to providers for complex questions.

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

## Clinic Onboarding
Partner with free clinics in Adams County. Make sure the clinics install the equipment below:
- Laptops, computers, or tablets
- High-speed internet access with secure VPN encryption for patient privacy

To ensure successful implementation, we will provide training for staff and volunteers at partner locations. The training includes:
- How to use our virtual clinic
- Ensuring patient confidentiality and secure data handling

We provide a 24/7 technical helpline for troubleshooting

## Patient Onboarding
Patient Awareness Campaigns：
- Bilingual (Spanish & English) flyers, including a QR code linked to our virtual clinic, at churches, schools, and grocery stores
- Engaging Latino communities through digital platforms, such as WhatsApp

Collaborates with churches and schools, where patients feel safe and supported. Supplying devices, such as tablets, at these locations to ensure patients without personal devices can access our virtual clinic.

Once patients successfully access our virtual clinic, they can schedule an appointment or use the AI chatbot for basic inquiries.

## Sustainability
We will apply for federal, state, and local healthcare grants that support pediatric care and underserved communities:
- Health Resources & Services Administration (HRSA). This program provides funding for free clinics. 
- Title V Maternal and Child Health (MCH). This program provides funding for pediatric health initiatives
- Maternal and Child Health Block Grant. This program supports improving the health of women, infants, children, youth, and their families.
- Bill & Melinda Gates Foundation. This program supports community health initiatives.
