
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import Pages & Components
import Index from "./pages/Index";
import ProviderLogin from "./components/ProviderLogin";
import ProviderDashboard from "./components/ProviderDashboard";
import PatientLogin from "./components/PatientLogin";
import PatientDashboard from "./components/PatientDashboard";
import PediatricIntakeForm from "./components/intake/PediatricIntakeForm";
import AppointmentPage from "./pages/AppointmentPage";
import AppointmentConfirmationPage from "./pages/AppointmentConfirmationPage";
import TransportationPage from "./pages/TransportationPage";
import ClinicLocatorPage from "./pages/ClinicLocatorPage";
import PatientOverviewPage from "./pages/PatientOverviewPage";
import { ChatPage } from "./pages/ChatPage";
import ConfirmationPage from "./pages/ConfirmationPage";

const App: React.FC = () => {
  // ✅ Manage Language Selection
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });

  useEffect(() => {
    sessionStorage.setItem("preferredLanguage", language);
  }, [language]);

  // ✅ Handle Progression (Placeholder for Future Actions)
  const handleProceed = () => {
    console.log("Proceeding to next step");
  };

  return (
    <BrowserRouter>
      {/* 🌐 Language Toggle Button */}
      <div className="flex justify-end p-4">
        <Button onClick={() => setLanguage((prev) => (prev === "en" ? "es" : "en"))}>
          {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
        </Button>
      </div>

      {/* 📌 Application Routes */}
      <Routes>
        {/* 🌍 General Pages */}
        <Route path="/" element={<Index />} />
        <Route path="/free-clinic" element={<ClinicLocatorPage />} />

        {/* 🔵 Patient Flow */}
        <Route path="/patient/login" element={<PatientLogin language={language} onBack={() => {}} onLogin={() => {}} />} />
        <Route path="/pediatric-intake" element={<PediatricIntakeForm language={language} />} />
        <Route path="/confirmation" element={<ConfirmationPage language={language} />} />
        <Route path="/patient/dashboard" element={<PatientDashboard language={language} />} />
        <Route path="/appointment" element={<AppointmentPage language={language} onProceed={handleProceed} />} />
        <Route path="/appointment-confirmation" element={<AppointmentConfirmationPage language={language} />} />
        <Route path="/transportation" element={<TransportationPage language={language} onProceed={handleProceed} />} />

        {/* 🏥 Provider Flow */}
        <Route path="/provider/login" element={<ProviderLogin language={language} onLogin={() => {}} />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />

        {/* 📂 Additional Pages */}
        <Route path="/patient/:patientId" element={<PatientOverviewPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:patientName" element={<ChatPage />} />

        {/* 🚨 404 Error Page */}
        <Route path="*" element={<h1 className="text-center text-red-500">404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
