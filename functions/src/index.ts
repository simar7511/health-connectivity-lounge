
import * as functions from "firebase-functions";
import { sendSMS, scheduleSMS } from "./twilioFunctions";

// Expose the sendSMS function
export const sendSMSFunction = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    await sendSMS(req, res);
  } catch (error) {
    console.error("Error in sendSMS function:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal server error");
    }
  }
});

// Expose the scheduleSMS function
export const scheduleSMSFunction = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    await scheduleSMS(req, res);
  } catch (error) {
    console.error("Error in scheduleSMS function:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal server error");
    }
  }
});
