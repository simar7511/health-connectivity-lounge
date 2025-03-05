
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Twilio } from "twilio";

// Define message type
export interface SMSMessage {
  to: string;
  body: string;
}

// Function to send SMS
export const sendSMS = async (
  request: functions.CallableRequest<SMSMessage>
) => {
  try {
    const data = request.data;
    
    if (!data || !data.to || !data.body) {
      throw new functions.HttpsError(
        'invalid-argument',
        'Missing required SMS fields: to, body'
      );
    }

    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !twilioNumber) {
      throw new functions.HttpsError(
        'failed-precondition',
        'Twilio credentials not configured'
      );
    }
    
    const twilioClient = new Twilio(accountSid, authToken);
    
    // Send message
    const message = await twilioClient.messages.create({
      body: data.body,
      from: twilioNumber,
      to: data.to
    });

    // Log SMS for tracking
    await admin.firestore().collection('smsLogs').add({
      to: data.to,
      body: data.body,
      status: message.status,
      sid: message.sid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    throw new functions.HttpsError(
      'internal',
      error.message || 'Failed to send SMS',
      error
    );
  }
};

// Handle incoming SMS
export const handleSMS = (message: any, context: any) => {
  // Process incoming SMS...
  console.log('Received SMS:', message);
  return { processed: true };
};

export const sendMessage = async (to: string, body: string) => {
  // Implementation for direct message sending
  // This is a helper function that can be used by other services
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !twilioNumber) {
      throw new Error('Twilio credentials not configured');
    }
    
    const twilioClient = new Twilio(accountSid, authToken);
    
    const message = await twilioClient.messages.create({
      body,
      from: twilioNumber,
      to
    });
    
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};
