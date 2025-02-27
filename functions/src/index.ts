
import * as functions from "firebase-functions";
import * as express from "express";
import { sendSMSDirect } from "./twilioFunctions";
import { aiHealthAssistant } from "./aiHealthAssistant";

// Export the Twilio SMS function using the correct signature for callable functions
export const sendSMSMessage = functions.https.onCall(async (data, _context) => {
  try {
    // Explicitly type the data to include to and message properties
    const to = data.to as string;
    const message = data.message as string;
    
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
