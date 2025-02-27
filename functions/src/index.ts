
import * as functions from "firebase-functions";
import { sendSMS } from "./twilioFunctions";
import { aiHealthAssistant } from "./aiHealthAssistant";

// Export the Twilio SMS function - using the correct signature
export const sendSMSMessage = functions.https.onCall((data, context) => {
  return sendSMS(data, context);
});

// Export the AI Health Assistant function
export { aiHealthAssistant };
