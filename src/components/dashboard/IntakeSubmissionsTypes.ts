
import { Timestamp } from "firebase/firestore";

export interface IntakeFormSubmission {
  id: string;
  childName: string;
  dob: string;
  phoneNumber: string;
  symptoms: string;
  medicalHistory: string;
  medicationsAndAllergies: string;
  hasRecentHospitalVisits: boolean | null;
  hospitalVisitLocation?: string;
  hasInsurance: boolean | null;
  otherConcerns?: string;
  language: "en" | "es";
  timestamp: Timestamp;
  notificationType: "sms" | "whatsapp";
  userId: string;
}

export interface IntakeSubmissionsListProps {
  language: "en" | "es";
}
