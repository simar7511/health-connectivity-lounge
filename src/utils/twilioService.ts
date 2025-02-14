
export const makeCall = async (toNumber: string) => {
  try {
    const response = await fetch('https://us-central1-YOUR_PROJECT.cloudfunctions.net/makeCall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toNumber }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }

    const data = await response.json();
    return data.callSid;
  } catch (error) {
    console.error('Error making Twilio call:', error);
    throw error;
  }
};

export const translateText = async (
  text: string, 
  fromLanguage: string, 
  toLanguage: string
) => {
  try {
    const response = await fetch(
      'https://us-central1-YOUR_PROJECT.cloudfunctions.net/translateText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, fromLanguage, toLanguage }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to translate text');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};
