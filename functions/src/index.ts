
import * as functions from "firebase-functions";
import { sendSMS, scheduleSMS } from "./twilioFunctions";

// Expose the sendSMS function
exports.sendSMS = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Call the function directly, not returning its result
  await sendSMS(req, res);
});

// Expose the scheduleSMS function
exports.scheduleSMS = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Call the function directly, not returning its result
  await scheduleSMS(req, res);
});
