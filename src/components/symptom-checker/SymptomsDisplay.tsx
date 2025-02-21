
interface SymptomsDisplayProps {
  language: "en" | "es";
  symptoms: string;
}

export const SymptomsDisplay = ({ language, symptoms }: SymptomsDisplayProps) => {
  if (!symptoms) return null;

  const mockIntakeForm = {
    patientInfo: {
      name: "Maria Garcia",
      dob: "1995-05-15",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      emergency_contact: "Juan Garcia - (555) 987-6543"
    },
    medicalHistory: {
      allergies: ["Penicillin"],
      currentMedications: ["Prenatal vitamins", "Iron supplements"],
      previousPregnancies: 1,
      chronicConditions: ["None"],
      familyHistory: ["Diabetes (maternal)", "Hypertension (paternal)"]
    },
    lifestyle: {
      occupation: "Office worker",
      exercise: "30 min walking, 3 times/week",
      diet: "Balanced, following nutritionist recommendations",
      smoking: "Never",
      alcohol: "None during pregnancy"
    },
    currentPregnancy: {
      lastPeriod: "2023-08-15",
      dueDate: "2024-05-22",
      firstPrenatalVisit: "2023-10-01",
      complications: "Mild morning sickness in first trimester"
    }
  };

  return (
    <div className="space-y-4">
      {/* Patient Intake Form Summary */}
      <div className="p-4 bg-secondary/5 rounded-lg">
        <h3 className="font-semibold mb-3">
          {language === "en" ? "Patient Information:" : "Información del Paciente:"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">
              {language === "en" ? "Basic Information" : "Información Básica"}
            </h4>
            <div className="space-y-1">
              <p><span className="font-medium">DOB:</span> {mockIntakeForm.patientInfo.dob}</p>
              <p><span className="font-medium">{language === "en" ? "Phone:" : "Teléfono:"}</span> {mockIntakeForm.patientInfo.phone}</p>
              <p><span className="font-medium">{language === "en" ? "Emergency Contact:" : "Contacto de Emergencia:"}</span> {mockIntakeForm.patientInfo.emergency_contact}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">
              {language === "en" ? "Medical History" : "Historial Médico"}
            </h4>
            <div className="space-y-1">
              <p><span className="font-medium">{language === "en" ? "Allergies:" : "Alergias:"}</span> {mockIntakeForm.medicalHistory.allergies.join(", ")}</p>
              <p><span className="font-medium">{language === "en" ? "Current Medications:" : "Medicamentos Actuales:"}</span> {mockIntakeForm.medicalHistory.currentMedications.join(", ")}</p>
              <p><span className="font-medium">{language === "en" ? "Previous Pregnancies:" : "Embarazos Previos:"}</span> {mockIntakeForm.medicalHistory.previousPregnancies}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Symptoms */}
      <div className="p-4 bg-secondary/10 rounded-lg">
        <h3 className="font-semibold mb-2">
          {language === "en" ? "Current Symptoms:" : "Síntomas Actuales:"}
        </h3>
        <p>{symptoms}</p>
      </div>

      {/* Current Pregnancy */}
      <div className="p-4 bg-secondary/5 rounded-lg">
        <h3 className="font-semibold mb-2">
          {language === "en" ? "Current Pregnancy Information:" : "Información del Embarazo Actual:"}
        </h3>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">{language === "en" ? "Due Date:" : "Fecha Probable de Parto:"}</span> {mockIntakeForm.currentPregnancy.dueDate}</p>
          <p><span className="font-medium">{language === "en" ? "First Prenatal Visit:" : "Primera Visita Prenatal:"}</span> {mockIntakeForm.currentPregnancy.firstPrenatalVisit}</p>
          <p><span className="font-medium">{language === "en" ? "Complications:" : "Complicaciones:"}</span> {mockIntakeForm.currentPregnancy.complications}</p>
        </div>
      </div>
    </div>
  );
};
