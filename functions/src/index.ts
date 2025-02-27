
import * as functions from "firebase-functions";
import * as express from "express";
import { sendSMSDirect } from "./twilioFunctions";
import { aiHealthAssistant } from "./aiHealthAssistant";

// Export the Twilio SMS function using the correct signature for callable functions
export const sendSMSMessage = functions.https.onCall(async (data, _context) => {
  try {
    // In Firebase Functions v2, data is directly the payload object
    // Cast the entire data object to an any type to access properties
    const payload = data as any;
    
    if (!payload || typeof payload !== 'object') {
      throw new Error("Invalid request data");
    }
    
    const to = payload.to;
    const message = payload.message;
    
    if (!to || !message) {
      throw new Error("Missing required parameters: to or message");
    }
    
    // Use the direct function that doesn't rely on Express request/response
    const result = await sendSMSDirect(to, message);
    return result;
  } catch (error) {
    console.error("Error in sendSMSMessage callable function:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
});

// Export the AI Health Assistant function
export { aiHealthAssistant };
