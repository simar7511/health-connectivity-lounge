
import { IntakeFormSubmission } from "./IntakeSubmissionsTypes";

/**
 * Estimate urgency based on symptoms and medical history
 */
export const getUrgencyLevel = (submission: IntakeFormSubmission): "low" | "medium" | "high" => {
  const urgentKeywords = [
    "severe", "emergency", "urgent", "bleeding", "difficulty breathing",
    "unconscious", "severe pain", "chest pain", "head injury", "trauma",
    "severo", "emergencia", "urgente", "sangrado", "dificultad para respirar",
    "inconsciente", "dolor severo", "dolor de pecho", "lesión en la cabeza"
  ];
  
  const symptomText = (submission.symptoms || "").toLowerCase();
  const medicalHistoryText = (submission.medicalHistory || "").toLowerCase();
  const combinedText = `${symptomText} ${medicalHistoryText}`;
  
  if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
    return "high";
  }
  
  // Medium urgency for recent hospital visits
  if (submission.hasRecentHospitalVisits) {
    return "medium";
  }
  
  return "low";
};
