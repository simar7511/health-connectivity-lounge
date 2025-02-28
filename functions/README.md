
# Firebase Functions for Health Connectivity

This directory contains the Firebase Cloud Functions for the Health Connectivity application.

## Setup and Deployment

### Prerequisites

1. Make sure you have the Firebase CLI installed:
   ```
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```
   firebase login
   ```

### Configuration

1. Create an `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   HUGGING_FACE_TOKEN=your_huggingface_token_here
   ```

3. Set the environment variables in your Firebase project:
   ```
   firebase functions:config:set openai.key="your_openai_api_key_here" huggingface.token="your_huggingface_token_here"
   ```

### Deploy Functions

To deploy all functions:
```
firebase deploy --only functions
```

To deploy a specific function (e.g., just the Llama proxy):
```
firebase deploy --only functions:llamaProxy
```

## Llama Proxy Function

The `llamaProxy` function acts as a backend proxy to the Hugging Face API for Llama 2 models. It solves CORS issues by allowing your frontend to communicate with your Firebase backend instead of directly with the Hugging Face API.

### Endpoint

POST: `https://[your-region]-[your-project-id].cloudfunctions.net/llamaProxy/generate`

### Request Format

```json
{
  "prompt": "Your prompt text here",
  "model": "llama-2-7b-chat", // optional, defaults to "llama-2-7b-chat"
  "max_new_tokens": 500, // optional, defaults to 500
  "temperature": 0.7, // optional, defaults to 0.7
  "top_p": 0.95, // optional, defaults to 0.95
  "do_sample": true // optional, defaults to true
}
```

### Response Format

```json
{
  "generated_text": "The AI-generated response text"
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Troubleshooting

- If you see a 503 error, the model is still loading on Hugging Face's servers. This can take some time for the first request.
- Make sure your Hugging Face token has permission to access the models you're trying to use.
- Check the Firebase Cloud Functions logs for detailed error messages.
