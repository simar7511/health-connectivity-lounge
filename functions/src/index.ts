
import * as admin from "firebase-admin";
import { aiChat } from "./aiChatService";
import { sendSms, sendWhatsAppMessage } from "./twilioFunctions";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export Cloud Functions
export {
  aiChat,
  sendSms,
  sendWhatsAppMessage
};
