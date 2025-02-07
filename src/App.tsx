
import * as React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";

import Index from "./pages/Index";
import ProviderLogin from "./components/ProviderLogin";
import ProviderDashboard from "./components/ProviderDashboard";
import PatientLogin from "./components/PatientLogin";
import PatientDashboard from "./components/PatientDashboard";
import AppointmentPage from "./pages/AppointmentPage";
import TransportationPage from "./pages/TransportationPage";
import ClinicLocatorPage from "./pages/ClinicLocatorPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import PatientOverviewPage from "./pages/PatientOverviewPage";
import { VoiceTranslator } from "./components/VoiceTranslator";
import { AppointmentDetails } from "./components/dashboard/AppointmentDetails";

const App = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

  // Mock patient data for demonstration
  const mockPatients = [
    {
      id: "1",
      name: "Jane Doe",
      language: "en" as const,
      nextAppointment: "2024-03-20T10:00:00",
      reasonForVisit: "Regular checkup",
      demographics: {
        age: 28,
        preferredLanguage: "es" as const,
        insuranceStatus: "insured" as const
      },
      vitals: {
        bp: [120, 80],
        glucose: [98],
        weight: [150],
        fetalMovements: [10]
      },
      risks: [],
      recentSymptoms: []
    }
  ];

  return (
    <BrowserRouter>
      <div className="flex justify-end p-4">
        <Button onClick={() => setLanguage((prev) => (prev === "en" ? "es" : "en"))}>
          {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
        </Button>
      </div>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/patient/login" element={<PatientLogin language={language} onBack={() => {}} onLogin={() => {}} />} />
        <Route path="/patient/dashboard" element={<PatientDashboard language={language} />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/transportation" element={<TransportationPage />} />
        <Route path="/free-clinic" element={<ClinicLocatorPage />} />
        <Route path="/symptoms" element={<SymptomCheckerPage />} />
        <Route path="/provider/login" element={<ProviderLogin language={language} onLogin={() => {}} />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />
        <Route path="/provider/appointments/:patientId" element={<AppointmentDetails language={language} patients={mockPatients} />} />
        <Route path="/patient/:patientId" element={<PatientOverviewPage />} />
        <Route path="*" element={<h1 className="text-center text-red-500">404 - Page Not Found</h1>} />
      </Routes>

      <div className="fixed bottom-4 right-4">
        <VoiceTranslator language={language} />
      </div>
    </BrowserRouter>
  );
};

export default App;

