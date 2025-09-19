import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Download } from "lucide-react";
import profileImage from "@assets/generated_images/Professional_headshot_portrait_a05b6387.png";

export default function Hero() {
  const handleContactClick = () => {
    console.log('Contact button clicked');
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadResume = () => {
    console.log('Download resume clicked');
    // In a real app, this would download the PDF
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4" data-testid="text-name">
                Deepali Bhatnagar
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6" data-testid="text-title">
                Assistant Professor & Business Development Professional
              </p>
              <p className="text-lg text-secondary-foreground leading-relaxed" data-testid="text-objective">
                Seeking a responsible career opportunity to expand my learnings and skills while making a significant contribution to the success of the company.
              </p>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span data-testid="text-phone">9165056722</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span data-testid="text-email">bhatnagarrdeepali@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span data-testid="text-location">Indore, India</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleContactClick}
                className="hover-elevate"
                data-testid="button-contact"
              >
                Get In Touch
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleDownloadResume}
                className="hover-elevate"
                data-testid="button-download"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>

          {/* Right content - Profile image */}
          <div className="flex justify-center md:justify-end">
            <Card className="p-2 bg-card hover-elevate">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Deepali Bhatnagar"
                  className="w-80 h-80 rounded-lg object-cover shadow-lg"
                  data-testid="img-profile"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}