
import * as functions from "firebase-functions";
import twilio from "twilio";
import cors from "cors";
import express from "express";

const corsHandler = cors({ origin: true });
const app = express();

// Use CORS middleware
app.use(corsHandler);

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACa7a76e6d230ef13e0631f01d8652702f";
const authToken = process.env.TWILIO_AUTH_TOKEN || "b76ce2403f8aecc261288328088510a5";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "+12063837604";

const client = twilio(accountSid, authToken);

// Express route for SMS sending
app.post("/send", async (request, response) => {
  try {
    // Extract parameters from request body
    const { to, message } = request.body;

    if (!to || !message) {
      response.status(400).send({ 
        error: "Bad Request", 
        message: "Both 'to' and 'message' parameters are required" 
      });
      return;
    }

    // Format the phone number if needed
    let formattedPhone = to.startsWith("+") ? to : `+1${to}`;

    // Log the SMS attempt
    console.log(`Attempting to send SMS to ${formattedPhone}`);

    // Send the SMS
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone
    });

    // Log success and return message SID
    console.log(`SMS sent successfully with SID: ${result.sid}`);
    response.status(200).send({
      success: true,
      sid: result.sid,
      status: result.status
    });
  } catch (error) {
    // Log and return error
    console.error("Error sending SMS:", error);
    response.status(500).send({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
});

// Health check endpoint required by Cloud Run
app.get("/", (req, res) => {
  res.status(200).send("SMS Service is healthy and running!");
});

// Export the express app for Cloud Functions
export const smsService = functions.https.onRequest(app);

// Only start the server if this file is run directly (not during deployment/build)
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`SMS service listening on port ${PORT}`);
  });
}
