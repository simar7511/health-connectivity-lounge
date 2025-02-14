
import { Twilio } from 'twilio';

export const makeCall = async (toNumber: string) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing Twilio credentials');
    }

    const client = new Twilio(accountSid, authToken);

    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: toNumber,
      from: fromNumber,
    });

    return call.sid;
  } catch (error) {
    console.error('Error making Twilio call:', error);
    throw error;
  }
};
