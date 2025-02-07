import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppointmentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">📅 Schedule an Appointment</h1>
      <p>Select the type of appointment you need:</p>
      <Button className="w-full py-6 bg-green-500 text-white">Prenatal Checkup</Button>
      <Button className="w-full py-6 bg-blue-500 text-white">General Consultation</Button>
      <Button className="w-full py-6 bg-red-500 text-white">Emergency Visit</Button>
      <Button
        className="mt-4 w-full py-6 bg-gray-500 text-white"
        onClick={() => navigate("/patient/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default AppointmentPage;

