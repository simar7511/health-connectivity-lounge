
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Index from "./pages/Index";
import PatientIntakeDetails from "./pages/PatientIntakeDetails";
import PatientOverviewPage from "./pages/PatientOverviewPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import AppointmentPage from "./pages/AppointmentPage";
import AppointmentConfirmationPage from "./pages/AppointmentConfirmationPage";
import TransportationPage from "./pages/TransportationPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ChatPage from "./pages/ChatPage";
import AIHealthChatPage from "./pages/AIHealthChatPage";
import ClinicLocatorPage from "./pages/ClinicLocatorPage";
import { AuthProvider } from "@/context/AuthContext";
import PediatricIntakeForm from "./components/intake/PediatricIntakeForm";

// Create routes
const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/pediatric-intake", element: <PediatricIntakeForm /> },
  { path: "/patient-intake/:id", element: <PatientIntakeDetails language="en" /> },
  { path: "/provider/dashboard", element: <PatientOverviewPage /> }, 
  { path: "/symptoms", element: <SymptomCheckerPage language="en" onProceed={() => {}} appointmentDetails={{type: "", date: new Date(), time: "", provider: {id: "", name: "", specialty: "", availability: []}}} /> },
  { path: "/appointment", element: <AppointmentPage language="en" /> },
  { path: "/appointment-confirmation", element: <AppointmentConfirmationPage language="en" /> },
  { path: "/transportation", element: <TransportationPage language="en" onProceed={() => {}} /> },
  { path: "/confirmation", element: <ConfirmationPage language="en" /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/ai-chat", element: <AIHealthChatPage /> },
  { path: "/ai-chat/:patientId", element: <AIHealthChatPage /> },
  { path: "/free-clinic", element: <ClinicLocatorPage /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
