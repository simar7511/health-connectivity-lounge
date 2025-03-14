
import React from "react";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationHeader title="Terms of Service" showBackButton={true} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Scroll className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Terms of Service</h1>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
              <p>
                Welcome to Safe Haven Pediatrics. By accessing or using our telehealth services, 
                including our AI Health Assistant, you agree to be bound by these Terms of Service. 
                Please read these terms carefully before using our services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use of Services</h2>
              <p>
                Safe Haven Pediatrics provides telehealth consultations and AI-powered health guidance 
                for pediatric care. While our AI Health Assistant can provide general health information, 
                it is not a substitute for professional medical advice, diagnosis, or treatment from a 
                qualified healthcare provider.
              </p>
              <p className="mt-3">
                Always consult with a qualified healthcare professional for specific medical concerns. 
                Our services supplement but do not replace the relationship between you and your child's 
                healthcare provider.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Eligibility</h2>
              <p>
                Our services are primarily intended for residents of Adams County, Washington. Parental 
                or legal guardian consent is required for any minor (under 18 years of age) to use our services.
              </p>
              <p className="mt-3">
                Safe Haven Pediatrics does not discriminate based on insurance status or immigration status. 
                We are committed to providing quality care for every child, regardless of background or circumstances.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Telehealth & AI Health Assistant</h2>
              <p>
                Our telehealth services and AI Health Assistant comply with applicable HIPAA regulations and 
                telemedicine laws. However, users should be aware of the inherent limitations of virtual care:
              </p>
              <ul className="list-disc pl-6 mt-3">
                <li>Virtual visits cannot always replace in-person examinations</li>
                <li>Technical issues may occasionally affect service quality</li>
                <li>The AI Health Assistant provides general guidance based on available information</li>
                <li>Emergency medical conditions should be addressed through emergency services (call 911)</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Privacy & Data Protection</h2>
              <p>
                Safe Haven Pediatrics is committed to protecting your privacy and complying with all relevant 
                data privacy laws, including HIPAA. For detailed information on how we collect, use, and 
                protect your health information, please refer to our Privacy Policy.
              </p>
              <p className="mt-3">
                By using our services, you consent to our data practices as described in the Privacy Policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Safe Haven Pediatrics shall not be liable for:
              </p>
              <ul className="list-disc pl-6 mt-3">
                <li>Technical failures or interruptions in service</li>
                <li>Inaccuracies or errors in AI-generated content</li>
                <li>Adverse outcomes resulting from delays in seeking in-person emergency care</li>
                <li>Losses or damages arising from your use of or inability to use our services</li>
              </ul>
              <p className="mt-3">
                For urgent medical issues, always seek appropriate in-person care immediately.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Compliance with Local Health Regulations</h2>
              <p>
                Safe Haven Pediatrics adheres to all applicable policies and regulations of the Adams County 
                Health Department and Washington State Department of Health. Our services are designed to 
                complement the existing healthcare system in accordance with local health jurisdiction requirements.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Information</h2>
              <p>
                For questions or concerns regarding these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                <p><strong>Safe Haven Pediatrics</strong></p>
                <p>Email: legal@safehavenpediatrics.org</p>
                <p>Phone: (509) 555-1234</p>
                <p>Address: 123 Health Way, Ritzville, WA 99169</p>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Changes to Terms</h2>
              <p>
                Safe Haven Pediatrics reserves the right to update or modify these Terms of Service at any time 
                without prior notice. Changes will be effective immediately upon posting to our website. Your 
                continued use of our services after any changes indicates your acceptance of the revised terms.
              </p>
              <p className="mt-3">
                Last updated: June 5, 2024
              </p>
            </section>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => navigate("/")}
              className="px-8"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
