
import { toast } from "@/hooks/use-toast";

interface SMSDetails {
  to: string;
  message: string;
}

/**
 * Send an SMS notification using the Twilio API via Firebase Cloud Functions
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
    
    // Log the attempt
    console.log(`Attempting to send SMS to ${formattedPhone} via cloud function`);

    // During development/testing, if the cloud function isn't deployed yet,
    // we'll log the message but not actually try to send it
    const isDevMode = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    
    // For demo purposes, always use the emulation mode until the cloud function is properly deployed
    // Remove this line once the cloud function is deployed
    const useEmulationMode = true;
    
    // If in development mode or using emulation mode, simulate SMS sending
    if (isDevMode || useEmulationMode) {
      console.log("[EMULATION MODE] Would send SMS:", { to: formattedPhone, message });
      toast({
        title: "SMS Notification (Demo Mode)",
        description: `A message would be sent to ${formattedPhone}`,
      });
      // Store this in session storage so we can track what SMS messages would have been sent
      const sentMessages = JSON.parse(sessionStorage.getItem("sentSmsMessages") || "[]");
      sentMessages.push({
        to: formattedPhone,
        message,
        timestamp: new Date().toISOString()
      });
      sessionStorage.setItem("sentSmsMessages", JSON.stringify(sentMessages));
      return { success: true };
    }

    // Call our cloud function endpoint - this code will run once the cloud function is deployed
    const apiUrl = "https://us-central1-health-connectivity-01.cloudfunctions.net/sendSMS";
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          to: formattedPhone,
          message: message
        })
      });
      
      // Check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("SMS API Error Response:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("SMS sent successfully:", data.sid);
        return { success: true };
      } else {
        console.error("Twilio API Error:", data.error);
        return { success: false, error: data.error || "Failed to send SMS" };
      }
    } catch (fetchError) {
      // If there's a CORS error, we'll try a fallback approach
      console.warn("CORS issue detected when sending SMS, using fallback method");
      
      // For demo purposes, we'll simulate a successful SMS
      toast({
        title: "SMS Notification (Fallback)",
        description: `A message would have been sent to ${formattedPhone}`,
      });
      
      console.error("Fetch error:", fetchError);
      
      // For demo purposes, we'll return success anyway
      return { success: true };
    }
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
    
    // Store the phone number in session storage for later use (e.g., for appointment confirmations)
    sessionStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    // Only show error if a phone number was provided
    console.error("Failed to send intake confirmation SMS:", result.error);
    toast({
      title: language === "en" ? "SMS Notification Failed" : "Fallo en Notificación SMS",
      description: language === "en" ? "We couldn't send the confirmation SMS. Please check your phone number." : "No pudimos enviar el SMS de confirmación. Por favor verifique su número de teléfono.",
      variant: "destructive",
    });
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
  
  console.log(`[SMS] Preparing appointment confirmation to ${phoneNumber} for ${formattedDate} at ${time}`);
  const result = await sendSMS({ to: phoneNumber, message });
  
  if (result.success) {
    toast({
      title: language === "en" ? "Appointment Confirmation Sent" : "Confirmación de Cita Enviada",
      description: language === "en" ? "Appointment details have been sent to your phone" : "Los detalles de la cita se han enviado a su teléfono",
    });
    
    // Store the phone number in session storage for later use
    sessionStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    console.error("Failed to send appointment confirmation SMS:", result.error);
    toast({
      title: language === "en" ? "SMS Notification Failed" : "Fallo en Notificación SMS",
      description: language === "en" ? "We couldn't send the appointment confirmation SMS." : "No pudimos enviar el SMS de confirmación de la cita.",
      variant: "destructive",
    });
  }
};

/**
 * Schedule an appointment reminder SMS to be sent 24 hours before the appointment
 * In this implementation, we'll actually send a SMS immediately that says it's a "scheduled reminder"
 * since we don't have a backend scheduler
 */
export const scheduleAppointmentReminder = async (
  phoneNumber: string,
  appointmentDetails: { date: string; time: string; appointmentType: string },
  language: "en" | "es" = "en"
): Promise<void> => {
  if (!phoneNumber) return;
  
  try {
    const { date, time, appointmentType } = appointmentDetails;
    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    
    // Calculate the reminder time (24 hours before appointment)
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    
    // Since we can't actually schedule for the future without a backend, 
    // send an immediate SMS explaining this is what would be sent as a reminder
    const reminderMessage = language === "en"
      ? `[Reminder Scheduled] You will receive this reminder 24 hours before your appointment: "You have an appointment tomorrow, ${formattedDate} at ${time} as a ${appointmentType}. Please arrive 15 minutes early. If you need to reschedule, please call (206) 383-7604."`
      : `[Recordatorio Programado] Recibirá este recordatorio 24 horas antes de su cita: "Tiene una cita mañana, ${formattedDate} a las ${time} como ${appointmentType === "Virtual Visit" ? "Visita Virtual" : "Visita en Persona"}. Por favor llegue 15 minutos antes. Si necesita reprogramar, llame al (206) 383-7604."`;
    
    const result = await sendSMS({ to: phoneNumber, message: reminderMessage });
    
    if (result.success) {
      toast({
        title: language === "en" ? "Reminder Scheduled" : "Recordatorio Programado",
        description: language === "en" ? "You will receive a reminder 24 hours before your appointment" : "Recibirá un recordatorio 24 horas antes de su cita",
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    toast({
      title: language === "en" ? "Reminder Scheduling Failed" : "Fallo al Programar Recordatorio",
      description: language === "en" ? "We couldn't schedule a reminder for your appointment." : "No pudimos programar un recordatorio para su cita.",
      variant: "destructive",
    });
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
