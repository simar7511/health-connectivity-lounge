const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "your-firebase-project-id";

/**
 * Initiates a Twilio call to a given number.
 * @param toNumber - The recipient's phone number.
 * @returns The Twilio Call SID if successful.
 */
export const makeCall = async (toNumber: string): Promise<string> => {
  if (!toNumber) throw new Error("❌ No phone number provided for Twilio call.");

  try {
    const response = await fetch(
      `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net/makeCall`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toNumber }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ Twilio Call Failed: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Twilio Call Successful: Call SID ${data.callSid}`);
    return data.callSid;
  } catch (error) {
    console.error("🚨 Error making Twilio call:", error);
    throw error;
  }
};

/**
 * Translates text using LibreTranslate API.
 * @param text - The text to translate.
 * @param fromLanguage - Source language code.
 * @param toLanguage - Target language code.
 * @returns Translated text.
 */
export const translateText = async (
  text: string,
  fromLanguage: string,
  toLanguage: string
): Promise<string> => {
  if (!text) throw new Error("❌ No text provided for translation.");
  if (!fromLanguage || !toLanguage) throw new Error("❌ Missing language codes for translation.");

  try {
    const response = await fetch(
      `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net/translateText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, fromLanguage, toLanguage }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ Translation Failed: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Translation Successful: ${data.translatedText}`);
    return data.translatedText;
  } catch (error) {
    console.error("🚨 Error translating text:", error);
    throw error;
  }
};
