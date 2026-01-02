import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen gradient-artistic">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/brand/logo-header.png" 
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
      <main className="container py-16 max-w-4xl">
        <div className="mb-12 text-center">
          <img 
            src="/brand/logo-full-lg.png" 
            alt="Solely Art" 
            className="h-24 w-auto mx-auto mb-8" 
          />
          <h1 className="text-4xl font-semibold mb-4">Privacy Policy</h1>
          <p className="text-foreground/60">Last Updated: December 20, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Solely Art™ ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our platform 
              at solelyart.com (the "Service").
            </p>
            <p className="leading-relaxed mt-4">
              Our platform is hosted on Manus infrastructure. By using our Service, you also acknowledge that 
              certain data processing is subject to Manus's privacy practices. We encourage you to review 
              Manus's privacy policy for additional information about their data handling practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.1 Information You Provide</h3>
            <p className="leading-relaxed">
              We collect information you voluntarily provide when using our Service:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
              <li><strong>Artist Profiles:</strong> Portfolio images, bio, services offered, pricing, and availability</li>
              <li><strong>Communications:</strong> Messages between artists and clients, support inquiries</li>
              <li><strong>Payment Information:</strong> Billing details processed through secure third-party providers</li>
              <li><strong>Reviews and Feedback:</strong> Ratings and comments about artist services</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <p className="leading-relaxed">
              When you access our Service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
              <li><strong>Cookies:</strong> Session cookies and authentication tokens</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Connect artists with potential clients</li>
              <li>Send administrative notifications and updates</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
            <p className="leading-relaxed">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>With Artists/Clients:</strong> To facilitate connections and transactions between users</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform</li>
              <li><strong>Payment Processors:</strong> To process payments securely</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information, 
              including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security assessments</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p className="leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute 
              security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Maintain your session and authentication state</li>
              <li>Remember your preferences</li>
              <li>Analyze how our Service is used</li>
              <li>Improve user experience</li>
            </ul>
            <p className="leading-relaxed mt-4">
              You can control cookies through your browser settings. Disabling cookies may affect the 
              functionality of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights and Choices</h2>
            <p className="leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:privacy@solelyart.com" className="text-primary hover:underline">privacy@solelyart.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide our Service to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="leading-relaxed mt-4">
              When you delete your account, we will delete or anonymize your personal information within 30 days, 
              except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our Service is not intended for users under 18 years of age. We do not knowingly collect personal 
              information from children. If we become aware that we have collected information from a child, we 
              will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. International Data Transfers</h2>
            <p className="leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of 
              residence. These countries may have different data protection laws. By using our Service, you 
              consent to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Third-Party Links</h2>
            <p className="leading-relaxed">
              Our Service may contain links to third-party websites or services. We are not responsible for 
              the privacy practices of these third parties. We encourage you to review their privacy policies 
              before providing any information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by 
              posting the updated policy on our website and updating the "Last Updated" date. Your continued 
              use of the Service after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Solely Art</strong><br />
              Email: <a href="mailto:privacy@solelyart.com" className="text-primary hover:underline">privacy@solelyart.com</a><br />
              Website: <Link href="/contact" className="text-primary hover:underline">Contact Form</Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. California Privacy Rights</h2>
            <p className="leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), 
              including the right to know what personal information is collected, the right to delete personal 
              information, and the right to opt-out of the sale of personal information. We do not sell personal 
              information.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img 
              src="/brand/logo-full-lg.png" 
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
