import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast.success("Message Sent", {
        description: data.emailSent 
          ? "Thank you for contacting us. We'll respond within 24-48 hours."
          : "Your message has been received. We'll respond within 24-48 hours.",
      });
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      category: formData.category,
      message: formData.message,
    });
  };

  const isSubmitting = submitMutation.isPending;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen gradient-artistic">
        {/* Header */}
        <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
          <div className="container flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/brand/logo-circle-text.svg" 
                alt="Solely Art" 
                className="h-16 w-auto transition-transform group-hover:scale-105" 
              />
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Browse Artists
              </Link>
            </nav>
          </div>
        </header>

        {/* Success Message */}
        <main className="container py-24 max-w-2xl text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold mb-4">Message Received!</h1>
            <p className="text-foreground/60 text-lg">
              Thank you for reaching out to Solely Art. Our team will review your message and respond within 24-48 business hours.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild>
              <Link href="/browse">Browse Artists</Link>
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-12 mt-auto">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <img 
                src="/brand/logo-circle-full.svg" 
                alt="Solely Art - Curated Connections" 
                className="h-16 w-auto" 
              />
              <div className="text-sm text-foreground/60 text-center md:text-right">
                <p>© 2025 Solely Art. All Rights Reserved.</p>
                <p className="mt-1">Solely Art™ is a trademark of Solely Art.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-artistic">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/brand/logo-circle-text.svg" 
              alt="Solely Art" 
              className="h-16 w-auto transition-transform group-hover:scale-105" 
            />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Browse Artists
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container py-16">
        <div className="mb-12 text-center">
          <img 
            src="/brand/logo-diamond-text.svg" 
            alt="Solely Art" 
            className="h-24 w-auto mx-auto mb-8" 
          />
          <h1 className="text-4xl font-semibold mb-4">Contact Us</h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Have a question, feedback, or partnership inquiry? We'd love to hear from you. 
            Fill out the form below and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60 mb-2">General Inquiries</p>
                <a href="mailto:hello@solelyart.com" className="text-primary hover:underline">
                  hello@solelyart.com
                </a>
                <p className="text-foreground/60 mt-4 mb-2">Support</p>
                <a href="mailto:support@solelyart.com" className="text-primary hover:underline">
                  support@solelyart.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  We typically respond within 24-48 business hours. For urgent matters, 
                  please indicate so in your message subject.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  Solely Art operates globally, connecting artists and clients worldwide. 
                  Our team works remotely across multiple time zones.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleChange("category", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="artist">Artist Application</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="press">Press & Media</SelectItem>
                          <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief subject line"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your inquiry in detail..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-foreground/50">
                      * Required fields
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">How do I become an artist on Solely Art?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  Click "Become an Artist" in the navigation menu to start your application. 
                  We review all applications to ensure quality standards.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">How do payments work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  Payments are processed securely through our platform. Artists receive payment 
                  after successful completion of commissioned work.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Can I request custom commissions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  Yes! Browse artist profiles and contact them directly to discuss custom 
                  projects. Each artist sets their own terms and pricing.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">What if I have a dispute with an artist?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  Contact our support team and we'll help mediate. We encourage clear 
                  communication and written agreements before starting projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-12 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img 
              src="/brand/logo-circle-full.svg" 
              alt="Solely Art - Curated Connections" 
              className="h-16 w-auto" 
            />
            <div className="text-sm text-foreground/60 text-center md:text-right">
              <p>© 2025 Solely Art. All Rights Reserved.</p>
              <p className="mt-1">Solely Art™ is a trademark of Solely Art.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
