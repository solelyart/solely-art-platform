import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
  /** Hide header and footer completely */
  hideChrome?: boolean;
  /** Use minimal header (just logo + back link) */
  minimalHeader?: boolean;
  /** Use minimal footer (just copyright) */
  minimalFooter?: boolean;
  /** Hide footer completely */
  hideFooter?: boolean;
  /** Hide newsletter in footer */
  hideNewsletter?: boolean;
  /** Additional class for the main content wrapper */
  className?: string;
}

/**
 * Universal Layout component that wraps all pages with consistent Header and Footer.
 * 
 * Usage:
 * - Default: Full header with nav + full footer with newsletter
 * - minimalHeader: Just logo and back link (for checkout, onboarding)
 * - minimalFooter: Just copyright line
 * - hideFooter: No footer at all (for dashboard pages that have their own)
 * - hideChrome: No header or footer (for special pages)
 */
export function Layout({
  children,
  hideChrome = false,
  minimalHeader = false,
  minimalFooter = false,
  hideFooter = false,
  hideNewsletter = false,
  className = "",
}: LayoutProps) {
  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      <Header variant={minimalHeader ? "minimal" : "default"} />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && (
        <Footer 
          variant={minimalFooter ? "minimal" : "default"} 
          showNewsletter={!hideNewsletter && !minimalFooter}
        />
      )}
    </div>
  );
}
