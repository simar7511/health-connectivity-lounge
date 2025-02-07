import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import twilio from "twilio";
import * as dotenv from "dotenv";

// ✅ Load environment variables from .env
dotenv.config();

// ✅ Initialize Firebase Admin SDK (Ensure it initializes only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

// ✅ Twilio Credentials (ensure .env contains these values)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

// ✅ Firestore reference
const db = admin.firestore();

/**
 * ✅ Cloud Function to send SMS using Twilio
 */
export const sendSMS = functions.https.onRequest(async (req, res): Promise<void> => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      res.status(400).json({ error: "Missing phoneNumber or message" }).end();
      return;
    }

    // ✅ Send SMS via Twilio
    const twilioResponse = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    console.log("✅ SMS sent successfully:", twilioResponse.sid);
    res.status(200).json({ success: true, sid: twilioResponse.sid }).end();

  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" }).end();
  }
});

/**
 * ✅ Cloud Function to handle appointment booking & send SMS confirmation
 */
export const bookAppointment = functions.https.onRequest(async (req, res): Promise<void> => {
  try {
    const { phoneNumber, appointmentType, language } = req.body;

    if (!phoneNumber || !appointmentType || !language) {
      res.status(400).json({ error: "Missing required fields" }).end();
      return;
    }

    // ✅ Store appointment in Firestore
    const appointmentRef = await db.collection("appointments").add({
      phoneNumber,
      appointmentType,
      language,
      createdAt: admin.firestore.Timestamp.now(),
    });

    console.log("✅ Appointment booked successfully:", appointmentRef.id);

    // ✅ Prepare SMS confirmation message
    const message =
      language === "es"
        ? `✅ Su cita para ${appointmentType} ha sido confirmada. Nos vemos pronto.`
        : `✅ Your appointment for ${appointmentType} has been confirmed. See you soon!`;

    // ✅ Send SMS confirmation
    await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.status(200).json({
      success: true,
      message: "Appointment booked & SMS sent!",
      appointmentId: appointmentRef.id,
    }).end();

  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" }).end();
  }
});

/**
 * ✅ Cloud Function to send WhatsApp message via Twilio
 */
export const sendWhatsApp = functions.https.onRequest(async (req, res): Promise<void> => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      res.status(400).json({ error: "Missing phoneNumber or message" }).end();
      return;
    }

    // ✅ Send WhatsApp message via Twilio
    const twilioResponse = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`, // Twilio requires `whatsapp:` prefix
      to: `whatsapp:${phoneNumber}`,
    });

    console.log("✅ WhatsApp message sent successfully:", twilioResponse.sid);
    res.status(200).json({ success: true, sid: twilioResponse.sid }).end();

  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    res.status(500).json({ error: "Failed to send WhatsApp message" }).end();
  }
});
