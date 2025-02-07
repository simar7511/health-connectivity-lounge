
interface BloodPressureReportData {
  patientName: string;
  examDate: string;
  systolic: number;
  diastolic: number;
}

export const generateBloodPressureReport = (data: BloodPressureReportData, language: 'en' | 'es') => {
  const { systolic, diastolic } = data;
  
  const getStatus = () => {
    if (systolic < 120 && diastolic < 80) return { status: "Normal", icon: "🟢" };
    if (systolic >= 120 && systolic < 130 && diastolic < 80) return { status: "Borderline High", icon: "🟡" };
    return { status: "High", icon: "🔴" };
  };

  const { status, icon } = getStatus();

  const content = {
    en: {
      title: "Blood Pressure Report",
      date: "Date",
      patient: "Patient Name",
      provider: "Provider",
      reading: "Blood Pressure Reading",
      systolic: "Systolic (Top Number)",
      diastolic: "Diastolic (Bottom Number)",
      status: "Status",
      mmHg: "mmHg",
      // ... More translations could be added here
    },
    es: {
      title: "Informe de Presión Arterial",
      date: "Fecha",
      patient: "Nombre del Paciente",
      provider: "Proveedor",
      reading: "Lectura de Presión Arterial",
      systolic: "Sistólica (Número Superior)",
      diastolic: "Diastólica (Número Inferior)",
      status: "Estado",
      mmHg: "mmHg",
      // ... More translations could be added here
    }
  };

  const t = content[language];

  return `
${t.title}
📅 ${t.date}: ${data.examDate}
👤 ${t.patient}: ${data.patientName}
🏥 ${t.provider}: Dr. Smith

🩺 ${t.reading}
📌 ${t.systolic}: ${systolic} ${t.mmHg}
📌 ${t.diastolic}: ${diastolic} ${t.mmHg}
📌 ${t.status}: ${icon} ${status}

// ... Full report content would be included here
`;
};
