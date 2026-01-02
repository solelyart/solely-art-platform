import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen gradient-artistic">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/brand/sla-header-logo.png" 
              alt="Solely Art" 
              className="h-10 w-auto transition-transform group-hover:scale-105" 
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
      <main className="container py-16 max-w-4xl">
        <div className="mb-12 text-center">
          <img 
            src="/brand/sla-logo-full-lg.png" 
            alt="Solely Art" 
            className="w-64 h-auto mx-auto mb-8" 
          />
          <h1 className="text-4xl font-semibold mb-4">Terms of Service</h1>
          <p className="text-foreground/60">Last Updated: December 20, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              Welcome to Solely Art™ ("we," "our," or "us"). By accessing or using our platform at solelyart.com 
              (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree 
              to these Terms, please do not use our Service.
            </p>
            <p className="leading-relaxed mt-4">
              Solely Art is a curated marketplace connecting artists with clients for creative services and 
              commissions. Our platform is hosted on Manus infrastructure, and by using our Service, you also 
              agree to comply with Manus's terms of service and acceptable use policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Eligibility</h2>
            <p className="leading-relaxed">
              You must be at least 18 years old to use our Service. By using Solely Art, you represent and 
              warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p className="leading-relaxed">
              To access certain features of our Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information during registration</li>
              <li>Updating your information to keep it current</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in 
              fraudulent, abusive, or illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Artist Services</h2>
            <p className="leading-relaxed">
              Artists on Solely Art are independent contractors, not employees of Solely Art. When you engage 
              an artist through our platform:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You enter into a direct agreement with the artist for their services</li>
              <li>Solely Art facilitates the connection but is not a party to the service agreement</li>
              <li>Artists are responsible for the quality and delivery of their work</li>
              <li>Pricing, timelines, and deliverables are determined by individual artists</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payments and Fees</h2>
            <p className="leading-relaxed">
              Solely Art may charge service fees for facilitating transactions between artists and clients. 
              All payments are processed through secure third-party payment processors. By making a payment, 
              you agree to the payment processor's terms of service.
            </p>
            <p className="leading-relaxed mt-4">
              Refund policies are determined by individual artists and should be discussed before commissioning 
              work. Solely Art is not responsible for disputes regarding refunds between artists and clients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              Unless otherwise agreed in writing between the artist and client:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Artists retain copyright to their original works</li>
              <li>Clients receive a license to use commissioned work as agreed upon</li>
              <li>Portfolio images displayed on Solely Art remain the property of the respective artists</li>
              <li>The Solely Art™ name, logo, and branding are trademarks of Solely Art</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Prohibited Conduct</h2>
            <p className="leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Attempt to circumvent our platform to avoid fees</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Upload malicious code or interfere with the Service's operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Content Guidelines</h2>
            <p className="leading-relaxed">
              All content uploaded to Solely Art must comply with our content guidelines. We reserve the right 
              to remove content that:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Contains illegal material</li>
              <li>Infringes on third-party rights</li>
              <li>Is hateful, discriminatory, or promotes violence</li>
              <li>Contains explicit adult content without proper labeling</li>
              <li>Violates Manus platform policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, 
              OR SECURE. WE DO NOT GUARANTEE THE QUALITY, ACCURACY, OR RELIABILITY OF ANY ARTIST SERVICES 
              OBTAINED THROUGH THE PLATFORM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
            <p className="leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOLELY ART SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, 
              INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify and hold harmless Solely Art, its officers, directors, employees, and 
              agents from any claims, damages, losses, or expenses arising from your use of the Service or 
              violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Modifications to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes 
              by posting the updated Terms on our website. Your continued use of the Service after such changes 
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to conflict of law principles. Any disputes arising from these Terms shall be 
              resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Solely Art</strong><br />
              Email: <a href="mailto:legal@solelyart.com" className="text-primary hover:underline">legal@solelyart.com</a><br />
              Website: <Link href="/contact" className="text-primary hover:underline">Contact Form</Link>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img 
              src="/brand/sla-logo-full-lg.png" 
              alt="Solely Art - Curated Connections" 
              className="h-10 w-auto" 
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
