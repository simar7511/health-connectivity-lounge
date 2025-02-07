import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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

const App = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

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
        <Route path="/provider/login" element={<ProviderLogin language={language} />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />
        <Route path="*" element={<h1 className="text-center text-red-500">404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
