
import * as functions from "firebase-functions";
import * as twilio from "twilio";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

// Initialize Twilio client
const initTwilioClient = () => {
  const accountSid = functions.config().twilio?.account_sid || process.env.TWILIO_ACCOUNT_SID;
  const authToken = functions.config().twilio?.auth_token || process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio credentials. Please check environment variables.");
  }
  
  return twilio(accountSid, authToken);
};

// Send SMS message
export const sendSMS = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Check request method
      if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
      }
      
      // Extract parameters from request
      const { to, message } = request.body;
      
      if (!to || !message) {
        response.status(400).json({ 
          success: false, 
          message: "Missing required parameters: 'to' and 'message' are required" 
        });
        return;
      }
      
      // Get Twilio client
      let client;
      try {
        client = initTwilioClient();
      } catch (error) {
        console.error("Twilio initialization error:", error);
        response.status(500).json({ 
          success: false, 
          message: "Failed to initialize Twilio client" 
        });
        return;
      }
      
      // Get Twilio phone number
      const from = functions.config().twilio?.phone_number || process.env.TWILIO_PHONE_NUMBER;
      
      if (!from) {
        response.status(500).json({ 
          success: false, 
          message: "Missing Twilio phone number. Please check environment variables." 
        });
        return;
      }
      
      // Send SMS
      const twilioResponse = await client.messages.create({
        body: message,
        from,
        to,
      });
      
      console.log("Twilio message sent:", twilioResponse.sid);
      
      response.status(200).json({ 
        success: true, 
        messageId: twilioResponse.sid,
        status: twilioResponse.status 
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
      response.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  });
});

// Schedule SMS message to be sent at a specific time
export const scheduleSMS = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Check request method
      if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
      }
      
      // Extract parameters from request
      const { to, message, sendAt } = request.body;
      
      if (!to || !message || !sendAt) {
        response.status(400).json({ 
          success: false, 
          message: "Missing required parameters: 'to', 'message', and 'sendAt' are required" 
        });
        return;
      }
      
      // Validate sendAt date
      const sendAtDate = new Date(sendAt);
      if (isNaN(sendAtDate.getTime())) {
        response.status(400).json({ 
          success: false, 
          message: "Invalid 'sendAt' date format" 
        });
        return;
      }
      
      // Get Twilio client
      let client;
      try {
        client = initTwilioClient();
      } catch (error) {
        console.error("Twilio initialization error:", error);
        response.status(500).json({ 
          success: false, 
          message: "Failed to initialize Twilio client" 
        });
        return;
      }
      
      // Get Twilio phone number
      const from = functions.config().twilio?.phone_number || process.env.TWILIO_PHONE_NUMBER;
      
      if (!from) {
        response.status(500).json({ 
          success: false, 
          message: "Missing Twilio phone number. Please check environment variables." 
        });
        return;
      }
      
      // For now, we'll just simulate scheduling by logging it
      // In a real implementation, you'd use a scheduling system or Twilio's scheduled messaging
      console.log(`Scheduled SMS to ${to} for ${sendAtDate.toISOString()}`);
      
      response.status(200).json({ 
        success: true, 
        scheduled: true,
        scheduledFor: sendAtDate.toISOString()
      });
    } catch (error) {
      console.error("Error scheduling SMS:", error);
      response.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  });
});
