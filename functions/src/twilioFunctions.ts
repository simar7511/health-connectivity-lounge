
import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";

// Initialize admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// For HTTP requests (Express)
export const sendSMS = async (req: express.Request, res: express.Response) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required parameters: to or message" 
      });
    }
    
    // Free implementation: just log the SMS that would be sent
    console.log(`Would send SMS to ${to}: ${message}`);
    
    return res.status(200).json({
      success: true,
      message: `SMS to ${to} would be sent with message: ${message}`
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// For direct calling from other functions or callable function
export const sendSMSDirect = async (to: string, message: string) => {
  try {
    if (!to || !message) {
      throw new Error("Missing required parameters: to or message");
    }
    
    // Free implementation: just log the SMS that would be sent
    console.log(`Would send SMS to ${to}: ${message}`);
    
    return {
      success: true,
      message: `SMS to ${to} would be sent with message: ${message}`
    };
  } catch (error) {
    console.error("Error sending SMS directly:", error);
    throw error;
  }
};

// Expose as a Cloud Function
export const twilioSendSMS = functions.https.onCall(async (data, context) => {
  try {
    const { to, message } = data;
    
    if (!to || !message) {
      throw new Error("Missing required parameters: to or message");
    }
    
    // Just log in this example
    console.log(`Would send SMS to ${to}: ${message}`);
    
    return {
      success: true,
      message: `SMS to ${to} would be sent with message: ${message}`
    };
  } catch (error) {
    console.error("Error in twilioSendSMS:", error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});
