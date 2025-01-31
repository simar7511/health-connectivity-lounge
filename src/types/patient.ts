export interface Patient {
  id: string;
  name: string;
  language: "en" | "es";
  nextAppointment: string;
  reasonForVisit: string;
  demographics: {
    age: number;
    preferredLanguage: "en" | "es";
    insuranceStatus: "insured" | "uninsured";
  };
  vitals: {
    bp: number[];
    glucose: number[];
    weight: number[];
    fetalMovements?: number[];
  };
  risks: string[];
  recentSymptoms: string[];
}