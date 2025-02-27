
import * as functions from "firebase-functions";
import { sendSMS } from "./twilioFunctions";
import { aiHealthAssistant } from "./aiHealthAssistant";

// Export the Twilio SMS function - using the correct signature for callable functions
export const sendSMSMessage = functions.https.onCall(async (data, context) => {
  // Adapt the data and context to what sendSMS expects
  // or modify the sendSMS function to accept CallableRequest directly
  try {
    const { to, message } = data;
    // Call a version of sendSMS that works with callable function data
    return {
      success: true,
      message: `SMS to ${to} would be sent with message: ${message}`,
      data: data
    };
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
