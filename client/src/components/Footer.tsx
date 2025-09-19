import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    console.log('Scroll to top clicked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-foreground" data-testid="text-footer-title">
              Deepali Bhatnagar
            </h3>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-footer-description">
              Assistant Professor and Business Development Professional dedicated to education excellence and strategic growth.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+919165056722" className="hover:text-primary transition-colors" data-testid="link-footer-phone">
                  +91 9165056722
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:bhatnagarrdeepali@gmail.com" className="hover:text-primary transition-colors" data-testid="link-footer-email">
                  bhatnagarrdeepali@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span data-testid="text-footer-location">Indore, India</span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Professional Focus</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Educational Leadership</p>
              <p>• Business Development</p>
              <p>• Economic Research</p>
              <p>• Student Mentorship</p>
              <p>• Sports Training</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm" data-testid="text-footer-copyright">
            © {currentYear} Deepali Bhatnagar. All rights reserved.
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="hover-elevate"
            data-testid="button-scroll-top"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
}