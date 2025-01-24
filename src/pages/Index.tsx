import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Doctors } from "@/components/Doctors";
import { MissionStatement } from "@/components/MissionStatement";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <MissionStatement />
      <Services />
      <Doctors />
    </div>
  );
};

export default Index;