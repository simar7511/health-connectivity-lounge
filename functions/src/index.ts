
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { aiChatHandler } from "./aiChatService";
import { handleSMS, sendMessage } from "./smsService";
import { createPatientRecordFromSMS, translateWithGoogle } from "./twilioFunctions";

admin.initializeApp();

// AI Health Assistant Functions
export const aiChat = functions.https.onCall(aiChatHandler);

// SMS Service Functions
export const sendSMS = functions.https.onCall(sendMessage);
export const receiveSMS = functions.https.onRequest(handleSMS);

// Twilio Functions
export const translateText = functions.https.onCall(translateWithGoogle);
export const createPatientFromSMS = functions.firestore
  .document("sms/{messageId}")
  .onCreate(createPatientRecordFromSMS);

