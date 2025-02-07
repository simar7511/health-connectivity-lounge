import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TransportationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">🚗 Need Transportation?</h1>
      <p>Select your preferred transport option:</p>
      <Button className="w-full py-6 bg-green-500 text-white">Request Uber</Button>
      <Button className="w-full py-6 bg-blue-500 text-white">Local Church Rides</Button>
      <Button className="w-full py-6 bg-purple-500 text-white">Community Van Service</Button>
      <Button
        className="mt-4 w-full py-6 bg-gray-500 text-white"
        onClick={() => navigate("/patient/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default TransportationPage;
