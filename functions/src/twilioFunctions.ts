
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// For HTTP requests (Express)
export const sendSMS = async (req: functions.https.Request, res: functions.Response) => {
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

// Schedule SMS messages
export const scheduleSMS = async (req: functions.https.Request, res: functions.Response) => {
  try {
    const { to, message, scheduledTime } = req.body;
    
    if (!to || !message || !scheduledTime) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required parameters: to, message, or scheduledTime" 
      });
    }
    
    // Free implementation: just log the scheduled SMS
    console.log(`Would schedule SMS to ${to} at ${scheduledTime}: ${message}`);
    
    return res.status(200).json({
      success: true,
      message: `SMS to ${to} would be scheduled for ${scheduledTime} with message: ${message}`
    });
  } catch (error) {
    console.error("Error scheduling SMS:", error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};
