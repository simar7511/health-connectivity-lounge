
import * as functions from "firebase-functions";
import { aiHealthAssistant } from "./aiHealthAssistant";
import { sendSms, scheduledSmsReminders, onNewAppointment } from "./smsService";
import { twilioReceive, twilioStatus } from "./twilioFunctions";
import { llamaProxy } from "./llama-proxy";

// Export all our functions
export {
  aiHealthAssistant,
  sendSms,
  scheduledSmsReminders,
  onNewAppointment,
  twilioReceive,
  twilioStatus,
  llamaProxy,
};

// A default function for testing
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
