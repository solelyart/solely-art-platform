import { Link } from "wouter";
import { FooterLogo } from "@/components/ResponsiveLogo";
import { NewsletterSignup } from "@/components/NewsletterSignup";

interface FooterProps {
  className?: string;
  variant?: "default" | "minimal";
  showNewsletter?: boolean;
}

export function Footer({ 
  className = "", 
  variant = "default",
  showNewsletter = true 
}: FooterProps) {
  
  // Minimal variant - just copyright (for focused pages)
  if (variant === "minimal") {
    return (
      <footer className={`border-t border-border/50 dark:border-[#333333] bg-card/50 dark:bg-[#0A0A0A] py-8 ${className}`}>
        <div className="container text-center text-sm text-foreground/50 font-light">
          <p>© 2025 Solely Art. All Rights Reserved.</p>
          <p className="mt-1">Solely Art™ is a trademark of Solely Art.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`border-t border-border/50 dark:border-[#333333] bg-card/50 dark:bg-[#0A0A0A] backdrop-blur-sm py-16 ${className}`}>
      <div className="container">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div>
            <div className="mb-6">
              <FooterLogo />
            </div>
            <p className="text-sm text-foreground/60 font-light leading-relaxed">
              Curating exceptional creative talent for discerning clients worldwide.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">For Artists</h3>
            <ul className="space-y-3 text-sm text-foreground/60 font-light">
              <li><Link href="/become-artist" className="hover:text-primary transition-colors">Join as Artist</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/availability" className="hover:text-primary transition-colors">Manage Availability</Link></li>
              <li><Link href="/portfolio-builder" className="hover:text-primary transition-colors">Portfolio Builder</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">For Clients</h3>
            <ul className="space-y-3 text-sm text-foreground/60 font-light">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Artists</Link></li>
              <li><Link href="/bookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
              <li><Link href="/messages" className="hover:text-primary transition-colors">Messages</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-foreground/60 font-light">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        {showNewsletter && (
          <div className="mb-12 pt-8 border-t border-border/50 dark:border-[#333333]">
            <div className="max-w-xl mx-auto text-center">
              <h3 className="font-semibold mb-3 text-lg">Join Our Community</h3>
              <p className="text-sm text-foreground/60 font-light mb-4">
                Get the latest artist spotlights, creative inspiration, and platform updates delivered to your inbox.
              </p>
              <NewsletterSignup variant="inline" className="justify-center" />
            </div>
          </div>
        )}
        
        <div className="pt-8 border-t border-border/50 dark:border-[#333333] text-center text-sm text-foreground/50 font-light">
          <p>© 2025 Solely Art. All Rights Reserved.</p>
          <p className="mt-1">Solely Art™ is a trademark of Solely Art.</p>
        </div>
      </div>
    </footer>
  );
}
