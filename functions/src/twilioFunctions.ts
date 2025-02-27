
import { Request, Response } from "express";
import twilio from "twilio"; // Changed to default import
import cors from "cors"; // Changed to default import

// Initialize Twilio client
const initTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio credentials. Please check environment variables.");
  }
  
  return twilio(accountSid, authToken);
};

// Send SMS message
export const sendSMS = async (req: Request, res: Response) => {
  try {
    // Handle CORS
    const corsHandler = cors({ origin: true });
    await new Promise((resolve, reject) => {
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // Extract parameters from request
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: 'to' and 'message' are required" 
      });
    }
    
    // Get Twilio client
    let twilioClient;
    try {
      twilioClient = initTwilioClient();
    } catch (error) {
      console.error("Twilio initialization error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to initialize Twilio client" 
      });
    }
    
    // Get Twilio phone number
    const from = process.env.TWILIO_PHONE_NUMBER;
    
    if (!from) {
      return res.status(500).json({ 
        success: false, 
        message: "Missing Twilio phone number. Please check environment variables." 
      });
    }
    
    // Log the SMS we're about to send
    console.log(`Sending SMS to ${to} from ${from}: "${message}"`);
    
    // Send SMS
    const twilioResponse = await twilioClient.messages.create({
      body: message,
      from,
      to,
    });
    
    console.log("Twilio message sent:", twilioResponse.sid);
    
    return res.status(200).json({ 
      success: true, 
      messageId: twilioResponse.sid,
      status: twilioResponse.status 
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    });
  }
};

// Schedule SMS message to be sent at a specific time (for future implementation)
export const scheduleSMS = async (req: Request, res: Response) => {
  try {
    // Handle CORS
    const corsHandler = cors({ origin: true });
    await new Promise((resolve, reject) => {
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // Extract parameters from request
    const { to, message, sendAt } = req.body;
    
    if (!to || !message || !sendAt) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: 'to', 'message', and 'sendAt' are required" 
      });
    }
    
    // Validate sendAt date
    const sendAtDate = new Date(sendAt);
    if (isNaN(sendAtDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid 'sendAt' date format" 
      });
    }
    
    // In a real implementation, you would store this in a database and have a scheduler
    // For now, we'll just log it
    console.log(`[SCHEDULED SMS] To: ${to}, At: ${sendAtDate.toISOString()}, Message: "${message}"`);
    
    return res.status(200).json({ 
      success: true, 
      scheduled: true,
      scheduledFor: sendAtDate.toISOString()
    });
  } catch (error) {
    console.error("Error scheduling SMS:", error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    });
  }
};
