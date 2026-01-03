import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { HeaderLogo } from "@/components/ResponsiveLogo";
import { UserAvatar } from "@/components/UserAvatar";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  className?: string;
  variant?: "default" | "minimal";
}

export function Header({ className = "", variant = "default" }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  // Minimal variant - just logo and back link (for focused pages like checkout)
  if (variant === "minimal") {
    return (
      <header className={`glass-nav sticky top-0 z-50 ${className}`}>
        <div className="container flex h-20 items-center justify-between">
          <Link href="/">
            <HeaderLogo className="transition-transform hover:scale-105" />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className={`glass-nav sticky top-0 z-50 ${className}`}>
      <div className="container flex h-20 items-center justify-between">
        <Link href="/">
          <HeaderLogo className="transition-transform hover:scale-105" />
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/browse" className="nav-link-brand" data-testid="nav-search">
            Browse Artists
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="nav-link-brand" data-testid="nav-dashboard">
                Dashboard
              </Link>
              <Link href="/availability" className="nav-link-brand">
                Availability
              </Link>
              <Link href="/bookings" className="nav-link-brand">
                Bookings
              </Link>
              <Link href="/messages" className="nav-link-brand">
                Messages
              </Link>
              <Button variant="brand-outline" size="sm" asChild data-testid="nav-become-artist">
                <Link href="/become-artist">Become an Artist</Link>
              </Button>
              <LogoutButton />
              <ThemeToggle variant="dropdown" />
              <button
                data-testid="user-menu"
                onClick={() => window.location.href = '/dashboard'}
                className="cursor-pointer transition-transform hover:scale-105"
                aria-label="Go to dashboard"
              >
                <UserAvatar photoUrl={user?.profilePhotoUrl} name={user?.name} size="sm" />
              </button>
            </>
          ) : (
            <>
              <ThemeToggle variant="dropdown" />
              <Button variant="brand" size="sm" asChild data-testid="login-button">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
