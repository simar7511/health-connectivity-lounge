import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Doctors } from "@/components/Doctors";
import { MissionStatement } from "@/components/MissionStatement";
import { Updates } from "@/components/Updates";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <MissionStatement />
      <Updates />
      <Services />
      <Doctors />
    </div>
  );
};

export default Index;