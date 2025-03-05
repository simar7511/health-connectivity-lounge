
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { aiChatHandler } from "./aiChatService";

// Initialize Firebase Admin
admin.initializeApp();

// AI Health Assistant Functions
// Using the v2 syntax for Cloud Functions
export const aiChat = functions.https.onCall(aiChatHandler);

// Placeholder for future SMS and Twilio functions
// These will be implemented later as needed
export const healthConnectivityStatus = functions.https.onCall(async (data, context) => {
  return {
    status: "online",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  };
});
