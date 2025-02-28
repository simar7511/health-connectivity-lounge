
import * as functions from "firebase-functions";
import { aiHealthAssistant } from "./aiHealthAssistant";
import { sendSMS } from "./smsService";
import { llamaProxy } from "./llama-proxy";

// Export all our functions
export {
  aiHealthAssistant,
  sendSMS,
  llamaProxy,
};

// A default function for testing
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
