import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Globe, MessageSquare, Database, Languages } from "lucide-react";

const services = [
  {
    title: "Prenatal Care",
    description: "Comprehensive prenatal care and monitoring for expectant mothers",
    icon: Baby,
  },
  {
    title: "Virtual Consultations",
    description: "Connect with your doctor from the comfort of your home",
    icon: MessageSquare,
  },
  {
    title: "Health Tracking",
    description: "Monitor your pregnancy journey with our digital tools",
    icon: Database,
  },
  {
    title: "Real-Time Translation",
    description: "Advanced translation tools ensuring clear and accurate communication during medical consultations",
    icon: Languages,
  }
];

export const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <service.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};