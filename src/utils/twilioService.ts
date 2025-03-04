
import { toast } from "@/hooks/use-toast";

interface SMSDetails {
  to: string;
  message: string;
}

interface WhatsAppDetails {
  to: string;
  message: string;
}

/**
 * Send an SMS notification using the mock SMS system
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
    console.log(`Simulating SMS to ${formattedPhone}`);
    console.log(`Message content: ${message}`);

    // Always use emulation mode 
    console.log("[FREE SMS SOLUTION] Capturing SMS:", { to: formattedPhone, message });
    toast({
      title: "SMS Notification Captured",
      description: `A message to ${formattedPhone} has been logged`,
    });
    
    // Store this in local storage so we can track what SMS messages would have been sent
    // Local storage persists across sessions, unlike sessionStorage
    const sentMessages = JSON.parse(localStorage.getItem("sentSmsMessages") || "[]");
    sentMessages.push({
      to: formattedPhone,
      message,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("sentSmsMessages", JSON.stringify(sentMessages));
    
    return { success: true };
  } catch (error) {
    console.error("Error capturing SMS:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

/**
 * Send a WhatsApp message using the WhatsApp Business API (free implementation)
 * @param to Phone number to send to (with country code)
 * @param message Message content
 * @returns Promise that resolves with success or error
 */
export const sendWhatsApp = async ({ to, message }: WhatsAppDetails): Promise<{ success: boolean; error?: string }> => {
  try {
    // Skip if no phone number provided
    if (!to || to.trim() === "") {
      console.log("No phone number provided, skipping WhatsApp");
      return { success: false, error: "No phone number provided" };
    }

    // Format phone number if needed
    const formattedPhone = formatPhoneNumber(to);
    
    // Log the attempt
    console.log(`Simulating WhatsApp message to ${formattedPhone}`);

    // Always use emulation mode 
    console.log("[FREE WHATSAPP SOLUTION] Capturing WhatsApp message:", { to: formattedPhone, message });
    toast({
      title: "WhatsApp Message Captured",
      description: `A WhatsApp message to ${formattedPhone} has been logged`,
    });
    
    // Store this in local storage so we can track what WhatsApp messages would have been sent
    const sentMessages = JSON.parse(localStorage.getItem("sentWhatsAppMessages") || "[]");
    sentMessages.push({
      to: formattedPhone,
      message,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("sentWhatsAppMessages", JSON.stringify(sentMessages));
    
    return { success: true };
  } catch (error) {
    console.error("Error capturing WhatsApp message:", error);
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
      title: language === "en" ? "Confirmation SMS Captured" : "SMS de Confirmación Capturado",
      description: language === "en" ? "A confirmation has been logged in your SMS inbox" : "Se ha registrado una confirmación en su bandeja de SMS",
    });
    
    // Store the phone number in local storage for later use (e.g., for appointment confirmations)
    localStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    // Only show error if a phone number was provided
    console.error("Failed to capture intake confirmation SMS:", result.error);
    toast({
      title: language === "en" ? "SMS Notification Failed" : "Fallo en Notificación SMS",
      description: language === "en" ? "We couldn't capture the confirmation SMS. Please check your phone number." : "No pudimos capturar el SMS de confirmación. Por favor verifique su número de teléfono.",
      variant: "destructive",
    });
  }
};

/**
 * Send intake form confirmation via WhatsApp
 */
export const sendIntakeFormWhatsAppConfirmation = async (phoneNumber: string, language: "en" | "es" = "en"): Promise<void> => {
  if (!phoneNumber) return;
  
  const message = language === "en" 
    ? "Thank you for submitting your pediatric intake form. Our team will review your information and contact you if additional details are needed. If this was not you, please call our clinic immediately."
    : "Gracias por enviar el formulario de admisión pediátrica. Nuestro equipo revisará su información y se comunicará con usted si se necesitan detalles adicionales. Si no fue usted, llame a nuestra clínica inmediatamente.";
  
  const result = await sendWhatsApp({ to: phoneNumber, message });
  
  if (result.success) {
    toast({
      title: language === "en" ? "Confirmation WhatsApp Captured" : "WhatsApp de Confirmación Capturado",
      description: language === "en" ? "A confirmation has been logged in your WhatsApp inbox" : "Se ha registrado una confirmación en su bandeja de WhatsApp",
    });
    
    // Store the phone number in local storage for later use
    localStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    console.error("Failed to capture intake confirmation WhatsApp:", result.error);
    toast({
      title: language === "en" ? "WhatsApp Notification Failed" : "Fallo en Notificación WhatsApp",
      description: language === "en" ? "We couldn't capture the confirmation WhatsApp. Please check your phone number." : "No pudimos capturar el WhatsApp de confirmación. Por favor verifique su número de teléfono.",
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
      title: language === "en" ? "Appointment Confirmation Captured" : "Confirmación de Cita Capturada",
      description: language === "en" ? "Appointment details have been logged in your SMS inbox" : "Los detalles de la cita se han registrado en su bandeja de SMS",
    });
    
    // Store the phone number in local storage for later use
    localStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    console.error("Failed to capture appointment confirmation SMS:", result.error);
    toast({
      title: language === "en" ? "SMS Notification Failed" : "Fallo en Notificación SMS",
      description: language === "en" ? "We couldn't capture the appointment confirmation SMS." : "No pudimos capturar el SMS de confirmación de la cita.",
      variant: "destructive",
    });
  }
};

/**
 * Send appointment confirmation via WhatsApp
 */
export const sendAppointmentWhatsAppConfirmation = async (
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
  
  console.log(`[WhatsApp] Preparing appointment confirmation to ${phoneNumber} for ${formattedDate} at ${time}`);
  const result = await sendWhatsApp({ to: phoneNumber, message });
  
  if (result.success) {
    toast({
      title: language === "en" ? "Appointment Confirmation Sent via WhatsApp" : "Confirmación de Cita Enviada por WhatsApp",
      description: language === "en" ? "Appointment details have been logged in your WhatsApp inbox" : "Los detalles de la cita se han registrado en su bandeja de WhatsApp",
    });
    
    // Store the phone number in local storage for later use
    localStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    console.error("Failed to capture appointment confirmation WhatsApp:", result.error);
    toast({
      title: language === "en" ? "WhatsApp Notification Failed" : "Fallo en Notificación WhatsApp",
      description: language === "en" ? "We couldn't capture the appointment confirmation WhatsApp." : "No pudimos capturar el WhatsApp de confirmación de la cita.",
      variant: "destructive",
    });
  }
};

/**
 * Schedule an appointment reminder SMS
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
    
    // Create a message that would be sent as a reminder
    const reminderMessage = language === "en"
      ? `[Reminder] You have an appointment tomorrow, ${formattedDate} at ${time} as a ${appointmentType}. Please arrive 15 minutes early. If you need to reschedule, please call (206) 383-7604.`
      : `[Recordatorio] Tiene una cita mañana, ${formattedDate} a las ${time} como ${appointmentType === "Virtual Visit" ? "Visita Virtual" : "Visita en Persona"}. Por favor llegue 15 minutos antes. Si necesita reprogramar, llame al (206) 383-7604.`;
    
    const result = await sendSMS({ to: phoneNumber, message: reminderMessage });
    
    if (result.success) {
      toast({
        title: language === "en" ? "Reminder Captured" : "Recordatorio Capturado",
        description: language === "en" ? "A reminder has been logged in your SMS inbox" : "Se ha registrado un recordatorio en su bandeja de SMS",
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error capturing reminder:", error);
    toast({
      title: language === "en" ? "Reminder Capture Failed" : "Fallo al Capturar Recordatorio",
      description: language === "en" ? "We couldn't capture the reminder for your appointment." : "No pudimos capturar el recordatorio para su cita.",
      variant: "destructive",
    });
  }
};

/**
 * Schedule an appointment reminder via WhatsApp
 */
export const scheduleAppointmentWhatsAppReminder = async (
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
    
    // Create a message that would be sent as a reminder
    const reminderMessage = language === "en"
      ? `[Reminder] You have an appointment tomorrow, ${formattedDate} at ${time} as a ${appointmentType}. Please arrive 15 minutes early. If you need to reschedule, please call (206) 383-7604.`
      : `[Recordatorio] Tiene una cita mañana, ${formattedDate} a las ${time} como ${appointmentType === "Virtual Visit" ? "Visita Virtual" : "Visita en Persona"}. Por favor llegue 15 minutos antes. Si necesita reprogramar, llame al (206) 383-7604.`;
    
    const result = await sendWhatsApp({ to: phoneNumber, message: reminderMessage });
    
    if (result.success) {
      toast({
        title: language === "en" ? "WhatsApp Reminder Captured" : "Recordatorio de WhatsApp Capturado",
        description: language === "en" ? "A reminder has been logged in your WhatsApp inbox" : "Se ha registrado un recordatorio en su bandeja de WhatsApp",
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error capturing WhatsApp reminder:", error);
    toast({
      title: language === "en" ? "WhatsApp Reminder Capture Failed" : "Fallo al Capturar Recordatorio de WhatsApp",
      description: language === "en" ? "We couldn't capture the WhatsApp reminder for your appointment." : "No pudimos capturar el recordatorio de WhatsApp para su cita.",
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
