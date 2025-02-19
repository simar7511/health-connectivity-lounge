
import { AppointmentDetails } from "@/components/symptom-checker/AppointmentDetails";
import { TranslationPlugin } from "@/components/provider/TranslationPlugin";

interface PatientOverviewPageProps {
  language: "en" | "es";
}

export const PatientOverviewPage = ({ language }: PatientOverviewPageProps) => {
  // Mock patient data
  const appointment = {
    type: "Prenatal Checkup",
    date: new Date(),
    time: "10:00 AM",
    provider: {
      id: "1",
      name: "Dr. Smith",
      specialty: "OB/GYN",
      availability: ["Monday", "Wednesday"]
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <TranslationPlugin language={language} patientLanguage="es" />
        <AppointmentDetails
          language={language}
          type={appointment.type}
          date={appointment.date}
          time={appointment.time}
          provider={appointment.provider}
        />
      </div>
    </div>
  );
};

export default PatientOverviewPage;
