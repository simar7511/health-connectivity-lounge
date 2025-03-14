
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

## LLM Prompt Library
This project utilized Large Language Models (LLMs) and AI-generated prompts for user research, prototype development, and hypothesis validation. Below is a library of key prompts used:

### User Research Prompts
To understand user needs, we conducted research using our patient persona, María González, and provider, Dr. Smith:

**Patient Prompt (María González):** How easy is it to navigate the website and find the care you need?

**Provider Prompt (Dr. Smith):** What common patient inquiries would you prefer an AI assistant to handle?

Led to the development of an AI Health Assistant to manage routine pediatric questions and reduce the provider's messaging burden.

### Prototype Development Prompts
We developed key features based on AI-driven insights and user needs:

**AI Health Assistant Prompt:**

I am addressing these concerns by developing an AI Health Assistant that answers common pediatric questions and supports Spanish translation. The assistant is designed to defer complex questions to providers, ensuring that patients receive accurate and appropriate care.

**Pediatric Intake Form Prompt:**

I need to create a pediatric intake form that collects essential medical information while ensuring privacy for undocumented families. The form should include sections for basic patient details (name, date of birth, preferred language), medical history (symptoms, medications, allergies), and social information (insurance status). It must have a clear confidentiality statement reassuring families that their data will not be shared with law enforcement or immigration authorities.

Additionally, the form should support English and Spanish, include voice input capabilities for accessibility, and have an automatic notification system to alert providers when urgent symptoms are detected. A confidentiality notice should be prominently displayed at the beginning of the form.

### Hypothesis Validation Prompts
To assess the effectiveness of AI-powered virtual clinics, we used the following prompts:

"Given user research findings, what additional data is needed to validate the hypothesis that AI-powered clinics improve patient retention?"

"How can I compare patient engagement between AI-assisted virtual clinics and traditional in-person visits?"

"Summarize key statistical methods to analyze the effectiveness of AI-based virtual clinics in rural areas."

### AI Health Assistant Development Prompts
To ensure the AI Health Assistant effectively supports both patients and providers, we used these guiding prompts:

"What are the most frequently asked questions in pediatric healthcare that an AI Health Assistant should address?"

"How can the AI Health Assistant reduce messaging burden on providers while still keeping patients engaged?"

## Features

- Patient and Provider portals
- Appointment scheduling and management
- Multilingual support (English/Spanish)
- Secure messaging system
- Pediatric intake form
- Symptom checker

## Development Setup
Follow these steps to set up and run the Safe Haven Virtual Pediatric Clinic locally.

### Prerequisites
Ensure you have the following installed before proceeding:

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd health-connectivity-platform
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Firebase
To use Firebase services (authentication, database, storage, etc.), you must set up your own Firebase project.

1. **Create a Firebase Project**
   - Go to Firebase Console and create a new project.
   - Set up Firestore Database, Authentication, and Storage as needed.

2. **Get Firebase Configuration**
   - In the Firebase Console, navigate to Project Settings > General > Your Apps.
   - Copy the Firebase SDK configuration and replace the placeholders in your .env file:

```plaintext
# Replace with your own Firebase project credentials
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important:**
- Do not share or commit API keys publicly.
- Add .env to your .gitignore file to keep it private.

### Step 4: Start the Development Server
```bash
npm run dev
```

Once the server is running, the application will be accessible at http://localhost:8080.

## API Key Configuration (For AI Features)
If you want to enable AI-powered features like the AI Health Assistant, configure API keys:

1. Navigate to the functions directory and create a .env file:
```bash
cd functions
cp .env.example .env
```

2. Add your AI API keys to .env:
```plaintext
OPENAI_API_KEY=your_openai_api_key
HUGGING_FACE_TOKEN=your_huggingface_token
```

3. Deploy Firebase Cloud Functions:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only functions
```

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```
This will deploy the application to Firebase Hosting and update Firebase functions.

## Additional Notes
- If using AI capabilities, confirm that the AI API keys are properly configured.
- For local testing of Firebase Cloud Functions, consider using Firebase Emulators before deployment.

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

Collaborating with churches and schools, where patients feel safe and supported. Supplying devices, such as tablets, at these locations to ensure patients without personal devices can access our virtual clinic.

Once patients successfully access our virtual clinic, they can schedule an appointment or use the AI chatbot for basic inquiries.

## Sustainability
We will apply for federal, state, and local healthcare grants that support pediatric care and underserved communities:
- Health Resources & Services Administration (HRSA). This program provides funding for free clinics. 
- Title V Maternal and Child Health (MCH). This program provides funding for pediatric health initiatives
- Maternal and Child Health Block Grant. This program supports improving the health of women, infants, children, youth, and their families.
- Bill & Melinda Gates Foundation. This program supports community health initiatives.
- Robert Wood Johnson Foundation (RWJF)
- Church donation

Embedding in churches, schools, pharmacies, community centers
- Builds trust with the congregation
- Strengthens educational equity
- Increases prescription sales and customer visits
- Enhances social services

With our virtual clinic’s telehealth appointment feature, we can engage medical students and retired providers to support virtual care, helping to alleviate the high provider-to-patient ratio

We will track patient engagement and clinic feedback to modify our promotion strategy and update the virtual clinic. 

Scalability:
- Phrase 1 (1 year): Only in Adams County
- Phrase 2 (2 years to 4 years): Expanding to surrounding rural counties with the same embedded method
- Phrase 3 (5 years and beyond): Expanding nationally by collaborating with larger organizations and communities

## Legal & Compliance Considerations
- Register as a 501(c)(3) nonprofit with the IRS to operate as a tax-exempt organization
- Obtain a business license from the Washington State Department of Revenue (DOR) to legally conduct healthcare operations
- Verify credentials through the Washington State Department of Health (DOH) to ensure compliance with professional licensing requirements
- Ensure healthcare providers have valid Washington state medical licenses, meeting all state regulations for telehealth and in-person care
- Comply with Clinical Laboratory Improvement Amendments (CLIA) regulations for any diagnostic testing services
- Adhere to HIPAA regulations, ensuring that all patient data is securely handled, stored, and transmitted to protect privacy
- Compliance with OSHA regulations, ensuring workplace safety for staff and healthcare providers
- Compliance with FDA regulations, ensuring AI meets FDA approval standards
- Ensure that AI serves solely as a support tool rather than making independent decisions. Following Washington State law, all medical decisions must be reviewed and approved by a licensed provider
- Compliance with Washington State laws, which typically require parental or legal guardian consent for minors to receive medical treatment, except in specific cases where minors can consent independently

## Security & Data Protection
- End-to-End Encryption: all virtual consultations, messages, and patient data transmissions are encrypted using TLS 1.2+, ensuring secure communication between patients and healthcare providers
- Secure Provider Authentication: use 2FA for provider login, ensuring that only authorized users can access patient data
- HIPAA-Compliant Cloud Storage: all patient records and telehealth data are securely stored in HIPAA-compliant cloud infrastructure (AWS, Google Cloud, or Azure) to maintain confidentiality and compliance
- AI and Data Protection: AI tools used in the clinic comply with Washington State and FDA regulations, ensuring that clinical decisions do not store or share sensitive patient data without consent
- Routine Security Audits Checks: the virtual clinic undergoes regular security assessments, ensuring no security issues and meeting county and state regulations

## Licensing
Our virtual clinic operates:
- Healthcare Licensing: the virtual clinic and its providers comply with Washington State laws and state medical licensing requirements
- Medical Software Certification: undergoing FDA regulation, ensuring the AI tools used in the virtual clinic meet FDA approval standards
- Usage Restrictions: all medical decisions must be reviewed and approved by a licensed provider. AI only serves as a support tool
- HIPAA and Data Protection Compliance: ensuring that all patient data storage meets HIPAA, state privacy laws, and federal telehealth regulations

## Collaboration with Local Health Jurisdictions & ACH Organizations
To ensure the effective deployment and sustainability of our virtual pediatric, we are coordinating with healthcare and public health organizations in Adams County:
- Adams County Health Department (ACHD): ensure compliance with state healthcare regulations, and expand access to virtual pediatric care.
- Greater Columbia Accountable Community of Health (GCACH): integrating the virtual clinic into existing rural healthcare networks, Medicaid-funded programs, and community health efforts in Adams County
- East Adams Rural Healthcare (EARH): validating the workflows and accuracy of AI diagnose
- Adams County schools, churches, and community centers: teaching patients how to access the virtual clinic. Improving accessibility. 
