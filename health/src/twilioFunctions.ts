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

// ✅ LibreTranslate API URL
const TRANSLATION_API_URL = process.env.TRANSLATION_API_URL || "https://libretranslate.com/translate";

/**
 * ✅ Function to send SMS via Twilio
 */
export const sendSms = functions.https.onCall(async (request, context) => {
  try {
    const phoneNumber: string | undefined = request.data?.phoneNumber;
    const message: string | undefined = request.data?.message;

    if (!phoneNumber || !message) {
      throw new functions.https.HttpsError("invalid-argument", "Missing phoneNumber or message.");
    }

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
    const phoneNumber: string | undefined = request.data?.phoneNumber;
    const message: string | undefined = request.data?.message;

    if (!phoneNumber || !message) {
      throw new functions.https.HttpsError("invalid-argument", "Missing phoneNumber or message.");
    }

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${phoneNumber}`,
    });

    console.log(`✅ WhatsApp message sent to ${phoneNumber}: ${response.sid}`);
    return { success: true, message: "WhatsApp message sent successfully." };
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    throw new functions.https.HttpsError("internal", "Failed to send WhatsApp message.");
  }
});

/**
 * ✅ Function to translate text using LibreTranslate API
 */
export const translateText = functions.https.onCall(async (request, context) => {
  try {
    const text: string | undefined = request.data?.text;
    const fromLanguage: string | undefined = request.data?.fromLanguage;
    const toLanguage: string | undefined = request.data?.toLanguage;

    if (!text || !fromLanguage || !toLanguage) {
      throw new functions.https.HttpsError("invalid-argument", "Missing text, fromLanguage, or toLanguage.");
    }

    console.log(`🔄 Sending translation request: ${text} (${fromLanguage} → ${toLanguage})`);

    // ✅ Use dynamic import for `node-fetch`
    const fetch = (await import("node-fetch")).default;

    // 📌 Send translation request to LibreTranslate API
    const response = await fetch(TRANSLATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: fromLanguage,
        target: toLanguage,
        format: "text"
      })
    });

    const data = await response.json();

    // 📌 Debugging: Log response
    console.log("🔍 Translation API response:", JSON.stringify(data, null, 2));

    // ✅ Ensure response has expected structure
    if (!data || typeof data !== "object" || !("translatedText" in data)) {
      console.error("❌ Translation API response error:", data);
      throw new functions.https.HttpsError("internal", "Unexpected response from translation API.");
    }

    console.log(`✅ Translated text: ${data.translatedText}`);

    return {
      success: true,
      translatedText: data.translatedText
    };
  } catch (error) {
    console.error("❌ Error translating text:", error);
    throw new functions.https.HttpsError("internal", "Failed to translate text.");
  }
});
