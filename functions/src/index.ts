
import * as functions from "firebase-functions";
import { sendSMS, sendWhatsAppMessage } from "./twilioFunctions";
import { aiHealthAssistant } from "./aiHealthAssistant";

// Export the original Twilio functions
export const sendSMSMessage = functions.https.onCall(sendSMS);
export const sendWhatsAppMsg = functions.https.onCall(sendWhatsAppMessage);

// Export the AI Health Assistant function
export { aiHealthAssistant };
