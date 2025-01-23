import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Brain, Heart, Activity } from "lucide-react";

const services = [
  {
    title: "General Medicine",
    description: "Comprehensive care for your general health needs",
    icon: Stethoscope,
  },
  {
    title: "Mental Health",
    description: "Professional mental health support and counseling",
    icon: Brain,
  },
  {
    title: "Cardiology",
    description: "Expert care for heart-related conditions",
    icon: Heart,
  },
  {
    title: "Wellness Programs",
    description: "Preventive care and lifestyle management",
    icon: Activity,
  },
];

export const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
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