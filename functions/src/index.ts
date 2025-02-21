import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Twilio from "twilio";

// Initialize Firebase Admin
admin.initializeApp();

// Load Twilio credentials from Firebase Config
const twilioConfig = functions.config().twilio;
const client = Twilio(twilioConfig.account_sid, twilioConfig.auth_token);

/**
 * ✅ Cloud Function: sendSmsNotification
 * This function sends an SMS notification to a patient after an appointment confirmation.
 */
export const sendSmsNotification = functions.https.onRequest(
  async (req, res) => {
    try {
      // Parse request body
      const { phoneNumber, message } = req.body;

      // ✅ Validate input
      if (!phoneNumber || !message) {
        res.status(400).json({ error: "Missing phoneNumber or message" });
        return;
      }

      // ✅ Send SMS using Twilio
      const twilioResponse = await client.messages.create({
        body: message,
        from: twilioConfig.phone_number, // Twilio phone number
        to: phoneNumber, // Patient's phone number
      });

      console.log("📲 SMS sent successfully:", twilioResponse.sid);
      res.status(200).json({ success: true, messageSid: twilioResponse.sid });

    } catch (error: unknown) { 
      console.error("❌ Error sending SMS:", error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message }); // ✅ Proper error handling
      } else {
        res.status(500).json({ error: "An unknown error occurred" }); // 🔥 Catch unexpected cases
      }
    }
  }
);
