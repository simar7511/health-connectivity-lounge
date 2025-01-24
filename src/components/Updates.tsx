import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Baby, MessageSquare } from "lucide-react";

export const Updates = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Recent Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Languages className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Medical Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Live medical interpreters now available to ensure accurate and culturally sensitive communication between providers and patients.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Baby className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Meet Dr. Sarah Smith</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Experienced OB/GYN focused on improving patient-provider communication and optimizing clinic workflow for better personalized care.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Enhanced Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                New tools to streamline patient communication and data management, enabling better focus on personalized care despite limited resources.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};