import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    image: "/placeholder.svg",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    image: "/placeholder.svg",
  },
  {
    name: "Dr. Emily Williams",
    specialty: "Mental Health",
    image: "/placeholder.svg",
  },
];

export const Doctors = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.name} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{doctor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{doctor.specialty}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};