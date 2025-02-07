import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ClinicLocatorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">🏥 Find a Free Clinic</h1>
      <p>Enter your location to find nearby clinics that provide free maternal care.</p>
      <input type="text" placeholder="Enter your city or ZIP code" className="w-full p-2 border rounded" />
      <Button className="w-full py-6 bg-blue-500 text-white">Search Clinics</Button>
      <Button
        className="mt-4 w-full py-6 bg-gray-500 text-white"
        onClick={() => navigate("/patient/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default ClinicLocatorPage;

  