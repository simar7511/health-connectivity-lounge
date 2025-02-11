import * as functions from "firebase-functions";
import { Twilio } from "twilio";
import * as dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

if (!accountSid || !authToken || !twilioPhone) {
  throw new Error("❌ Missing Twilio environment variables!");
}

// ✅ Initialize Twilio client
const client = new Twilio(accountSid, authToken);

/**
 * ✅ Function to send SMS via Twilio
 */
export const sendSms = functions.https.onCall(async (request, context) => {
  try {
    // ✅ Extract data directly from request.data
    const phoneNumber: string | undefined = request.data?.phoneNumber;
    const message: string | undefined = request.data?.message;

    if (!phoneNumber || !message) {
      throw new functions.https.HttpsError("invalid-argument", "Missing phoneNumber or message.");
    }

    // ✅ Send SMS
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber,
    });

    console.log(`✅ SMS sent to ${phoneNumber}: ${response.sid}`);
    return { success: true, message: "SMS sent successfully." };
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    throw new functions.https.HttpsError("internal", "Failed to send SMS.");
  }
});

/**
 * ✅ Function to send WhatsApp Message via Twilio
 */
export const sendWhatsApp = functions.https.onCall(async (request, context) => {
  try {
    // ✅ Extract data directly from request.data
    const phoneNumber: string | undefined = request.data?.phoneNumber;
    const message: string | undefined = request.data?.message;

    if (!phoneNumber || !message) {
      throw new functions.https.HttpsError("invalid-argument", "Missing phoneNumber or message.");
    }

    // ✅ Send WhatsApp message
    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhone}`, // ✅ Twilio requires `whatsapp:` prefix
      to: `whatsapp:${phoneNumber}`,
    });

    console.log(`✅ WhatsApp message sent to ${phoneNumber}: ${response.sid}`);
    return { success: true, message: "WhatsApp message sent successfully." };
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    throw new functions.https.HttpsError("internal", "Failed to send WhatsApp message.");
  }
});