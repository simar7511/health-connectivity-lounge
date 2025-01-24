import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

export const MissionStatement = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-8">
          <HeartHandshake className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Through our virtual care clinic, we strive to improve access to healthcare for marginalized communities in Adams County. We've seen firsthand how patients like Tina, a 25-year-old pregnant woman with high blood pressure, have benefited from our bilingual healthcare resources and comprehensive virtual care services.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Our goal is to strengthen the patient-provider relationship, enhance health literacy, and break down communication barriers. By incorporating advanced language models, we enable our patients to make informed decisions about their health, ensuring that quality healthcare is accessible to all, regardless of language or background.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};