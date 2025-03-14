
import { type Timestamp } from "@/types/firebase";

export interface IntakeFormSubmission {
  id: string;
  childName: string;
  parentName?: string;
  contactPhone?: string;
  age?: number;
  chiefComplaint?: string;
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
