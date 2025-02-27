
import { toast } from "@/hooks/use-toast";

interface SMSDetails {
  to: string;
  message: string;
}

/**
 * Send an SMS notification using the Twilio API
 * @param to Phone number to send to (with country code)
 * @param message Message content
 * @returns Promise that resolves with success or error
 */
export const sendSMS = async ({ to, message }: SMSDetails): Promise<{ success: boolean; error?: string }> => {
  try {
    // Skip if no phone number provided
    if (!to || to.trim() === "") {
      console.log("No phone number provided, skipping SMS");
      return { success: false, error: "No phone number provided" };
    }

    // Format phone number if needed
    const formattedPhone = formatPhoneNumber(to);
    
    // Call our backend function that uses Twilio
    const response = await fetch("/api/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: formattedPhone,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Twilio SMS Error:", errorData);
      return { success: false, error: errorData.message || "Failed to send SMS" };
    }

    const data = await response.json();
    console.log("SMS sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

/**
 * Format phone number to ensure it includes country code
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // If no country code (assuming US), add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If it doesn't start with +, add it
  if (!phone.startsWith("+")) {
    return `+${digits}`;
  }
  
  return phone;
};

/**
 * Send intake form confirmation SMS
 */
export const sendIntakeFormConfirmation = async (phoneNumber: string, language: "en" | "es" = "en"): Promise<void> => {
  if (!phoneNumber) return;
  
  const message = language === "en" 
    ? "Thank you for submitting your pediatric intake form. Our team will review your information and contact you if additional details are needed. If this was not you, please call our clinic immediately."
    : "Gracias por enviar el formulario de admisión pediátrica. Nuestro equipo revisará su información y se comunicará con usted si se necesitan detalles adicionales. Si no fue usted, llame a nuestra clínica inmediatamente.";
  
  const result = await sendSMS({ to: phoneNumber, message });
  
  if (result.success) {
    toast({
      title: language === "en" ? "Confirmation SMS Sent" : "SMS de Confirmación Enviado",
      description: language === "en" ? "A confirmation has been sent to your phone" : "Se ha enviado una confirmación a su teléfono",
    });
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    // Only show error if a phone number was provided
    console.error("Failed to send intake confirmation SMS:", result.error);
  }
};

/**
 * Send appointment confirmation SMS
 */
export const sendAppointmentConfirmation = async (
  phoneNumber: string,
  appointmentDetails: { date: string; time: string; appointmentType: string },
  language: "en" | "es" = "en"
): Promise<void> => {
  if (!phoneNumber) return;
  
  const { date, time, appointmentType } = appointmentDetails;
  const formattedDate = new Date(date).toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const message = language === "en"
    ? `Your appointment has been scheduled for ${formattedDate} at ${time} as a ${appointmentType}. If you need to reschedule, please visit our website or call (206) 383-7604.`
    : `Su cita ha sido programada para el ${formattedDate} a las ${time} como ${appointmentType === "Virtual Visit" ? "Visita Virtual" : "Visita en Persona"}. Si necesita reprogramar, visite nuestro sitio web o llame al (206) 383-7604.`;
  
  const result = await sendSMS({ to: phoneNumber, message });
  
  if (result.success) {
    toast({
      title: language === "en" ? "Appointment Confirmation Sent" : "Confirmación de Cita Enviada",
      description: language === "en" ? "Appointment details have been sent to your phone" : "Los detalles de la cita se han enviado a su teléfono",
    });
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    console.error("Failed to send appointment confirmation SMS:", result.error);
  }
};

/**
 * Schedule an appointment reminder SMS to be sent 24 hours before the appointment
 */
export const scheduleAppointmentReminder = async (
  phoneNumber: string,
  appointmentDetails: { date: string; time: string; appointmentType: string },
  language: "en" | "es" = "en"
): Promise<void> => {
  if (!phoneNumber) return;
  
  try {
    // This would typically call a server endpoint that would schedule the reminder
    // For now, we'll just log that we'd schedule it
    console.log("Would schedule reminder SMS for 24 hours before:", appointmentDetails);
    
    // In a real implementation, you would call a backend API that uses Twilio's 
    // scheduled messaging feature or your own scheduling system
    
    // We're not implementing the actual scheduling mechanism in this prototype
    // as it would require a server-side component
    
    toast({
      title: language === "en" ? "Reminder Scheduled" : "Recordatorio Programado",
      description: language === "en" ? "You will receive a reminder 24 hours before your appointment" : "Recibirá un recordatorio 24 horas antes de su cita",
    });
  } catch (error) {
    console.error("Error scheduling reminder:", error);
  }
};

/**
 * Translate text from one language to another
 * This function is used by the VoiceTranslator component
 */
export const translateText = async (
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> => {
  try {
    console.log(`Translating: "${text}" from ${fromLang} to ${toLang}`);
    
    // For now, we'll implement a simple mock translation
    // In a real implementation, you would call a translation API or service
    // We'll handle just English-Spanish and Spanish-English translations for common phrases
    
    // Simple translation dictionary
    const translations: Record<string, Record<string, string>> = {
      "en": {
        "hello": "hola",
        "goodbye": "adiós",
        "thank you": "gracias",
        "please": "por favor",
        "yes": "sí",
        "no": "no",
        "help": "ayuda",
        "doctor": "médico",
        "pain": "dolor",
        "medication": "medicamento",
        "appointment": "cita"
      },
      "es": {
        "hola": "hello",
        "adiós": "goodbye",
        "gracias": "thank you",
        "por favor": "please",
        "sí": "yes",
        "no": "no",
        "ayuda": "help",
        "médico": "doctor",
        "dolor": "pain",
        "medicamento": "medication",
        "cita": "appointment"
      }
    };
    
    // Mock translation by looking up words in our simple dictionary
    // For real translation, you would use a service like Google Translate, LibreTranslate, or DeepL
    const lowerText = text.toLowerCase();
    
    // Check if the text is directly in our dictionary
    if (fromLang in translations && lowerText in translations[fromLang]) {
      return translations[fromLang][lowerText];
    }
    
    // In a real implementation, we would call a translation API here
    // For now, just append a note that this is a mock translation
    const mockTranslation = `[${toLang}] ${text} (mock translation)`;
    
    console.log(`Translation result: "${mockTranslation}"`);
    return mockTranslation;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
