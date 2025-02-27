
import { toast } from "@/hooks/use-toast";
import { sendSMS, sendWhatsApp } from "./twilioService";

interface ProviderNotificationData {
  patientName: string;
  symptoms: string;
  urgency: "high" | "medium" | "low";
  contactPhone?: string;
  language: "en" | "es";
}

/**
 * Send a notification to providers when a new intake form is submitted
 */
export const notifyProviders = async (data: ProviderNotificationData): Promise<void> => {
  try {
    // Get provider phone numbers from settings
    // In a real app, these would come from a database of provider preferences
    const providerPhones = localStorage.getItem("providerNotificationPhones");
    
    if (!providerPhones) {
      console.log("No provider phones configured for notifications");
      return;
    }
    
    const phones = JSON.parse(providerPhones) as string[];
    
    // Prepare notification message based on urgency
    const getUrgencyText = (urgency: "high" | "medium" | "low") => {
      switch (urgency) {
        case "high":
          return data.language === "en" ? "HIGH URGENCY" : "ALTA URGENCIA";
        case "medium":
          return data.language === "en" ? "Medium Urgency" : "Urgencia Media";
        case "low":
          return data.language === "en" ? "Low Urgency" : "Baja Urgencia";
      }
    };
    
    const message = data.language === "en"
      ? `New Intake Form: ${data.patientName} - ${getUrgencyText(data.urgency)}. Symptoms: ${data.symptoms.substring(0, 100)}${data.symptoms.length > 100 ? '...' : ''}. ${data.contactPhone ? `Patient phone: ${data.contactPhone}` : 'No contact phone provided.'}`
      : `Nuevo Formulario: ${data.patientName} - ${getUrgencyText(data.urgency)}. Síntomas: ${data.symptoms.substring(0, 100)}${data.symptoms.length > 100 ? '...' : ''}. ${data.contactPhone ? `Teléfono del paciente: ${data.contactPhone}` : 'No se proporcionó teléfono de contacto.'}`;
    
    // Send notifications to all configured providers
    for (const phone of phones) {
      // Provider preference could determine SMS vs WhatsApp
      // For now, just use SMS for simplicity
      await sendSMS({ to: phone, message });
      
      console.log(`Provider notification sent to ${phone}`);
    }
    
    toast({
      title: data.language === "en" ? "Provider Notification Sent" : "Notificación a Proveedores Enviada",
      description: data.language === "en" 
        ? "Providers have been notified about the new intake form submission."
        : "Los proveedores han sido notificados sobre el nuevo envío del formulario de admisión.",
    });
    
  } catch (error) {
    console.error("Error sending provider notifications:", error);
    toast({
      title: data.language === "en" ? "Notification Error" : "Error de Notificación",
      description: data.language === "en"
        ? "Failed to notify providers about the new submission."
        : "No se pudo notificar a los proveedores sobre el nuevo envío.",
      variant: "destructive",
    });
  }
};

/**
 * Configure provider notification settings
 */
export const configureProviderNotifications = (
  providerPhones: string[],
  notificationPreferences: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  }
): void => {
  // Store provider notification preferences
  localStorage.setItem("providerNotificationPhones", JSON.stringify(providerPhones));
  localStorage.setItem("providerNotificationPreferences", JSON.stringify(notificationPreferences));
  
  toast({
    title: "Provider Notification Settings Updated",
    description: `Notifications will be sent to ${providerPhones.length} provider(s).`,
  });
};

/**
 * Estimated urgency based on symptoms and medical history 
 */
export const estimateUrgency = (
  symptoms: string,
  medicalHistory: string = "",
  hasRecentHospitalVisit: boolean | null = null
): "high" | "medium" | "low" => {
  const urgentKeywords = [
    "severe", "emergency", "urgent", "bleeding", "difficulty breathing",
    "unconscious", "severe pain", "chest pain", "head injury", "trauma",
    "severo", "emergencia", "urgente", "sangrado", "dificultad para respirar",
    "inconsciente", "dolor severo", "dolor de pecho", "lesión en la cabeza"
  ];
  
  const combinedText = `${symptoms.toLowerCase()} ${medicalHistory.toLowerCase()}`;
  
  if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
    return "high";
  }
  
  // Medium urgency for recent hospital visits
  if (hasRecentHospitalVisit) {
    return "medium";
  }
  
  return "low";
};
