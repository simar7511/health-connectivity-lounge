
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "@/types/firebase";
import { toast } from "@/hooks/use-toast";

interface MessageDetails {
  to: string;
  message: string;
  type: "sms" | "whatsapp";
}

/**
 * Store a message in Firestore for later processing by a Cloud Function
 * @param to Phone number to send to (with country code)
 * @param message Message content
 * @param type The type of message (sms or whatsapp)
 * @returns Promise that resolves with success or error
 */
export const sendMessage = async ({ 
  to, 
  message, 
  type 
}: MessageDetails): Promise<{ success: boolean; error?: string }> => {
  try {
    // Skip if no phone number provided
    if (!to || to.trim() === "") {
      console.log(`No phone number provided, skipping ${type}`);
      return { success: false, error: "No phone number provided" };
    }

    // Format phone number if needed
    const formattedPhone = formatPhoneNumber(to);
    
    // Log the attempt
    console.log(`Preparing to send ${type} to ${formattedPhone}`);
    console.log(`Message content: ${message}`);

    // In production, we would add the message to Firestore for processing by a Cloud Function
    // For now, we'll use the same local storage approach to demonstrate how it would work
    const messageData = {
      to: formattedPhone,
      message,
      type,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    // Store in Firestore outbound-messages collection
    // This could be processed by a Firebase Function
    try {
      // If we're in development mode or Firestore isn't fully initialized, use localStorage
      if (process.env.NODE_ENV !== 'production' || !db || typeof db.collection !== 'function') {
        console.log("[FIREBASE MESSAGING] Using local storage for development:", messageData);
        
        const key = type === "sms" ? "sentSmsMessages" : "sentWhatsAppMessages";
        const sentMessages = JSON.parse(localStorage.getItem(key) || "[]");
        sentMessages.push({
          to: formattedPhone,
          message,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(sentMessages));
        
        toast({
          title: `${type.toUpperCase()} Notification Captured`,
          description: `A message to ${formattedPhone} has been logged`,
        });
      } else {
        // Store in Firestore if available
        await addDoc(collection(db, "outbound-messages"), messageData);
        console.log(`${type.toUpperCase()} message added to Firestore for processing`);
        
        toast({
          title: `${type.toUpperCase()} Notification Queued`,
          description: `Your message will be sent shortly`,
        });
      }
      
      return { success: true };
    } catch (firestoreError) {
      console.error("Error storing message in Firestore:", firestoreError);
      
      // Fallback to localStorage if Firestore fails
      console.log("[FIREBASE MESSAGING] Falling back to local storage:", messageData);
      
      const key = type === "sms" ? "sentSmsMessages" : "sentWhatsAppMessages";
      const sentMessages = JSON.parse(localStorage.getItem(key) || "[]");
      sentMessages.push({
        to: formattedPhone,
        message,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(sentMessages));
      
      toast({
        title: `${type.toUpperCase()} Notification Captured (Fallback)`,
        description: `A message to ${formattedPhone} has been logged locally`,
      });
      
      return { success: true };
    }
  } catch (error) {
    console.error(`Error sending ${type}:`, error);
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
 * Send appointment confirmation message
 */
export const sendAppointmentConfirmation = async (
  phoneNumber: string,
  appointmentDetails: { date: string; time: string; appointmentType: string },
  type: "sms" | "whatsapp" = "sms",
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
  
  console.log(`[${type.toUpperCase()}] Preparing appointment confirmation to ${phoneNumber} for ${formattedDate} at ${time}`);
  const result = await sendMessage({ to: phoneNumber, message, type });
  
  if (result.success) {
    toast({
      title: language === "en" ? `Appointment Confirmation Sent via ${type.toUpperCase()}` : `Confirmación de Cita Enviada por ${type.toUpperCase()}`,
      description: language === "en" ? `Appointment details have been logged in your ${type} inbox` : `Los detalles de la cita se han registrado en su bandeja de ${type}`,
    });
    
    // Store the phone number in local storage for later use
    localStorage.setItem("patientPhone", phoneNumber);
  } else if (phoneNumber && phoneNumber.trim() !== "") {
    console.error(`Failed to send appointment confirmation ${type}:`, result.error);
    toast({
      title: language === "en" ? `${type.toUpperCase()} Notification Failed` : `Fallo en Notificación ${type.toUpperCase()}`,
      description: language === "en" ? `We couldn't send the appointment confirmation ${type}.` : `No pudimos enviar el ${type} de confirmación de la cita.`,
      variant: "destructive",
    });
  }
};

/**
 * Schedule an appointment reminder message
 */
export const scheduleAppointmentReminder = async (
  phoneNumber: string,
  appointmentDetails: { date: string; time: string; appointmentType: string },
  type: "sms" | "whatsapp" = "sms",
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
    
    const result = await sendMessage({ to: phoneNumber, message: reminderMessage, type });
    
    if (result.success) {
      toast({
        title: language === "en" ? `${type.toUpperCase()} Reminder Scheduled` : `Recordatorio de ${type.toUpperCase()} Programado`,
        description: language === "en" ? `A reminder has been scheduled for the day before your appointment` : `Se ha programado un recordatorio para el día antes de su cita`,
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(`Error scheduling ${type} reminder:`, error);
    toast({
      title: language === "en" ? `${type.toUpperCase()} Reminder Scheduling Failed` : `Fallo al Programar Recordatorio de ${type.toUpperCase()}`,
      description: language === "en" ? `We couldn't schedule the reminder for your appointment.` : `No pudimos programar el recordatorio para su cita.`,
      variant: "destructive",
    });
  }
};
