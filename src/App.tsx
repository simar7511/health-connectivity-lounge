import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import Index from "./pages/Index";
import ProviderLogin from "./components/ProviderLogin";
import ProviderDashboard from "./components/ProviderDashboard";
import PatientLogin from "./components/PatientLogin";
import PatientDashboard from "./components/PatientDashboard";
import PediatricIntakeForm from "./components/intake/PediatricIntakeForm";
import AppointmentPage from "./pages/AppointmentPage";
import TransportationPage from "./pages/TransportationPage";
import ClinicLocatorPage from "./pages/ClinicLocatorPage";
import PatientOverviewPage from "./pages/PatientOverviewPage";
import { VoiceTranslator } from "./components/VoiceTranslator";
import { ChatPage } from "./pages/ChatPage";
import ConfirmationPage from "./pages/ConfirmationPage"; // ✅ Updated confirmation page import

const App = () => {
  const [language, setLanguage] = useState<"en" | "es">(() => {
    const saved = sessionStorage.getItem("preferredLanguage") as "en" | "es" | null;
    return saved || "en";
  });

  useEffect(() => {
    sessionStorage.setItem("preferredLanguage", language);
  }, [language]);

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
        <Route path="/patient/intake" element={<PatientIntakeForm />} />
        <Route path="/pediatric-intake" element={<PediatricIntakeForm language={language} />} />

        {/* ✅ Confirmation Page Route - Now Uses `useLocation()` */}
        <Route path="/confirmation" element={<ConfirmationPage language={language} />} />

        <Route path="/patient/dashboard" element={<PatientDashboard language={language} />} />

        {/* ✅ Appointment Page Uses `navigate` Instead of `window.location.href` */}
        <Route 
          path="/appointment" 
          element={
            <AppointmentPage 
              language={language} 
              onProceed={(details) => {
                const navigate = useNavigate(); // ✅ Use navigate inside event
                navigate("/confirmation", { state: details });  // ✅ Pass details as state
              }} 
            />
          } 
        />

        <Route path="/transportation" element={<TransportationPage language={language} onProceed={() => {}} />} />
        <Route path="/free-clinic" element={<ClinicLocatorPage />} />

        <Route path="/provider/login" element={<ProviderLogin language={language} onLogin={() => {}} />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />
        <Route path="/patient/:patientId" element={<PatientOverviewPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:patientName" element={<ChatPage />} />

        {/* 404 Page Handling */}
        <Route path="*" element={<h1 className="text-center text-red-500">404 - Page Not Found</h1>} />
      </Routes>

      <div className="fixed bottom-4 right-4">
        <VoiceTranslator language={language} />
      </div>

      {/* ✅ Navigation to Pediatric Intake Form */}
      <div className="p-4">
        <Link to="/pediatric-intake" className="text-blue-500 underline">
          Go to Pediatric Intake Form
        </Link>
      </div>
    </BrowserRouter>
  );
};

export default App;
