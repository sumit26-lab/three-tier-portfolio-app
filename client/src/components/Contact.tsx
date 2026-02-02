import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function Contact() {
  // --- STATE ---
  const [data, setData] = useState<any>(null); // For Dynamic Name/Phone/Email
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // --- FETCH DYNAMIC CONTACT INFO ---
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch('/api/hero'); // Get your profile data
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  // --- HANDLE FORM CHANGES ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- SEND INQUIRY TO API ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSendSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset
        setTimeout(() => setSendSuccess(false), 3000); // Hide success after 3s
      } else {
        alert("Failed to send message. Check server logs.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error connecting to server.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return null;

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
      
      {/* --- PROFESSIONAL LOADING OVERLAY --- */}
      {(isSending || sendSuccess) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md">
          <Card className="p-8 flex flex-col items-center gap-4 shadow-2xl border-primary/20 animate-in zoom-in-95">
            {isSending ? (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h3 className="font-bold text-lg">Sending Message...</h3>
                <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress-loop"></div>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 animate-in bounce-in" />
                <h3 className="font-bold text-lg text-green-600">Message Sent Successfully!</h3>
                <p className="text-sm text-muted-foreground text-center">I will get back to you soon.</p>
              </>
            )}
          </Card>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate or discuss opportunities? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Information (Dynamic) */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Let's Connect</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you're looking for an academic professional or business development expertise, I'm open to meaningful conversations.
              </p>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Phone className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href={`tel:${data?.phone}`} className="text-primary hover:underline">{data?.phone || "+91 9165056722"}</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Mail className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${data?.email}`} className="text-primary hover:underline">{data?.email || "bhatnagarrdeepali@gmail.com"}</a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><MapPin className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{data?.location || "Indore, India"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="hover-elevate bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="What's this about?" value={formData.subject} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Tell me more..." rows={5} value={formData.message} onChange={handleInputChange} required />
                </div>
                <Button type="submit" size="lg" className="w-full shadow-lg" disabled={isSending}>
                  {isSending ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}