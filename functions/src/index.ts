
import * as functions from "firebase-functions";
import * as twilioFunctions from "./twilioFunctions";

// Health-related functions
export const sendSMS = twilioFunctions.sendSMS;
export const scheduleSMS = twilioFunctions.scheduleSMS;

// Hello world function (for testing)
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
