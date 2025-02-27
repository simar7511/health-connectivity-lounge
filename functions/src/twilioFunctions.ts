
import { Request, Response } from "express";
import twilio from "twilio";
import cors from "cors";

// Initialize Twilio client
const initTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || 
                     process.env.FUNCTIONS_CONFIG_TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN || 
                    process.env.FUNCTIONS_CONFIG_TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio credentials. Please check environment variables.");
  }
  
  return twilio(accountSid, authToken);
};

// Send SMS message
export const sendSMS = async (req: Request, res: Response): Promise<void> => {
  try {
    // Handle CORS
    const corsHandler = cors({ origin: true });
    await new Promise<void>((resolve, reject) => {
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Extract parameters from request
    const { to, message } = req.body;
    
    if (!to || !message) {
      res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: 'to' and 'message' are required" 
      });
      return;
    }
    
    // Get Twilio client
    let twilioClient;
    try {
      twilioClient = initTwilioClient();
    } catch (error) {
      console.error("Twilio initialization error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to initialize Twilio client" 
      });
      return;
    }
    
    // Get Twilio phone number
    const from = process.env.TWILIO_PHONE_NUMBER || 
                 process.env.FUNCTIONS_CONFIG_TWILIO_PHONE_NUMBER;
    
    if (!from) {
      res.status(500).json({ 
        success: false, 
        message: "Missing Twilio phone number. Please check environment variables." 
      });
      return;
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
    
    res.status(200).json({ 
      success: true, 
      sid: twilioResponse.sid,
      status: twilioResponse.status 
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  }
};

// Schedule SMS message to be sent at a specific time (for future implementation)
export const scheduleSMS = async (req: Request, res: Response): Promise<void> => {
  try {
    // Handle CORS
    const corsHandler = cors({ origin: true });
    await new Promise<void>((resolve, reject) => {
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Extract parameters from request
    const { to, message, sendAt } = req.body;
    
    if (!to || !message || !sendAt) {
      res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: 'to', 'message', and 'sendAt' are required" 
      });
      return;
    }
    
    // Validate sendAt date
    const sendAtDate = new Date(sendAt);
    if (isNaN(sendAtDate.getTime())) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid 'sendAt' date format" 
      });
      return;
    }
    
    // In a real implementation, you would store this in a database and have a scheduler
    // For now, we'll just log it
    console.log(`[SCHEDULED SMS] To: ${to}, At: ${sendAtDate.toISOString()}, Message: "${message}"`);
    
    res.status(200).json({ 
      success: true, 
      scheduled: true,
      scheduledFor: sendAtDate.toISOString()
    });
  } catch (error) {
    console.error("Error scheduling SMS:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  }
};
