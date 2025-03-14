# Health Connectivity Platform

## API Key Configuration

This application now uses server-side API keys for AI services. To configure:

1. Edit the `functions/.env` file with your actual API keys:
   - `OPENAI_API_KEY` for OpenAI services
   - `HUGGING_FACE_TOKEN` for Hugging Face / Llama services

2. Deploy the updated Firebase Functions:
   ```
   cd functions
   npm install
   firebase deploy --only functions
   ```

3. No user-provided API keys are needed anymore - the application will use the server-side keys automatically.

## Important Firebase Functions Changes

The `aiChatService.ts` function now reads API keys from environment variables instead of from client requests:

```typescript
// Inside aiChatService.ts:
// Replace:
const apiKey = data.apiKey;

// With:
const apiKey = process.env.OPENAI_API_KEY || process.env.HUGGING_FACE_TOKEN;
```

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your API keys in `functions/.env`
4. Start the development server: `npm run dev`

## Production Deployment

1. Build the project: `npm run build`
2. Deploy to Firebase: `firebase deploy`

## Target Audience
Marginalized groups, including those who are undocumented, uninsured, and have limited English proficiency, face significant barriers to accessing healthcare.
