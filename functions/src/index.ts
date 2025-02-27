
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendSMS } from "./smsService";

// Initialize Firebase Admin
admin.initializeApp();

// Export the SMS function to make it available
export { sendSMS };

// Welcome message function (example)
export const welcome = functions.https.onRequest((request, response) => {
  response.send("Welcome to Health Connectivity API!");
});

// Add more exported functions as needed
