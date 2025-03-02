
import * as functions from "firebase-functions";
import { aiChat } from "./aiChatService";
import { llamaProxy } from "./llama-proxy";
import { sendSms, getMessages } from "./twilioFunctions";
import { setupSmsService } from "./smsService";

// Export all functions
export { 
  aiChat,
  llamaProxy,
  sendSms, 
  getMessages,
  setupSmsService
};

// Create an HTTP function that will be the gateway to our application
export const api = functions.https.onRequest((request, response) => {
  // Set CORS headers
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }
  
  // Route the request to the appropriate function based on the path
  const path = request.path.split('/').filter(Boolean);
  
  if (path[0] === 'ai-chat') {
    return aiChat(request, response);
  } else if (path[0] === 'local-ai-chat') {
    return llamaProxy(request, response);
  } else if (path[0] === 'sms') {
    if (path[1] === 'send') {
      return sendSms(request, response);
    } else if (path[1] === 'messages') {
      return getMessages(request, response);
    }
  }
  
  // If no route matches, return 404
  response.status(404).send({ error: 'Not Found' });
});
