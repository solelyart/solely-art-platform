import { useState, useEffect } from 'react';

interface ResponsiveLogoProps {
  variant?: 'header' | 'footer' | 'hero';
  className?: string;
  linkTo?: string;
}

/**
 * ResponsiveLogo - SolelyArt brand logo with responsive sizing
 * 
 * Uses the official SolelyArt brand assets:
 * - logo-full-teal.png: Teal logo on transparent (for light backgrounds)
 * - logo-full-dark.png: Dark version (for light backgrounds)
 * - logo-full-light.png: Light version (for dark backgrounds)
 * - logo-full-white.png: White version (for colored/dark backgrounds)
 * 
 * Breakpoints:
 * - Mobile (< 640px): Smaller logo
 * - Tablet (640-1023px): Medium logo
 * - Desktop (1024px+): Full size logo
 */
export function ResponsiveLogo({ variant = 'header', className = '', linkTo }: ResponsiveLogoProps) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine which logo to show based on variant and screen size
  const getLogoConfig = () => {
    if (variant === 'header') {
      // Header uses teal logo
      return {
        src: '/images/brand/logo-full-teal.png',
        alt: 'SolelyArt',
        height: screenSize === 'mobile' ? 36 : screenSize === 'tablet' ? 40 : 48,
        width: screenSize === 'mobile' ? 100 : screenSize === 'tablet' ? 120 : 140,
      };
    }
    
    if (variant === 'footer') {
      // Footer uses teal logo, slightly smaller
      return {
        src: '/images/brand/logo-full-teal.png',
        alt: 'SolelyArt',
        height: screenSize === 'mobile' ? 40 : screenSize === 'tablet' ? 48 : 56,
        width: screenSize === 'mobile' ? 110 : screenSize === 'tablet' ? 130 : 150,
      };
    }
    
    if (variant === 'hero') {
      // Hero uses larger logo
      return {
        src: '/images/brand/logo-full-teal.png',
        alt: 'SolelyArt',
        height: screenSize === 'mobile' ? 60 : screenSize === 'tablet' ? 80 : 100,
        width: screenSize === 'mobile' ? 160 : screenSize === 'tablet' ? 220 : 280,
      };
    }

    // Default fallback
    return {
      src: '/images/brand/logo-full-teal.png',
      alt: 'SolelyArt',
      height: 40,
      width: 120,
    };
  };

  const config = getLogoConfig();

  const logoImage = (
    <img
      src={config.src}
      alt={config.alt}
      width={config.width}
      height={config.height}
      className={`object-contain ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      loading={variant === 'header' ? 'eager' : 'lazy'}
    />
  );

  if (linkTo) {
    return (
      <a href={linkTo} className="flex items-center shrink-0">
        {logoImage}
      </a>
    );
  }

  return logoImage;
}

/**
 * HeaderLogo - Optimized for navigation bars
 * Uses the SolelyArt teal logo with proper sizing
 */
export function HeaderLogo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className="flex items-center shrink-0">
      <img
        src="/images/brand/logo-full-teal.png"
        alt="SolelyArt"
        className={`h-9 sm:h-10 md:h-12 w-auto object-contain ${className}`}
        style={{ minWidth: '100px', maxWidth: '160px' }}
        loading="eager"
      />
    </a>
  );
}

/**
 * FooterLogo - Full stacked logo for footer sections
 * Responsive sizing with proper aspect ratio preservation
 */
export function FooterLogo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className="inline-block">
      <img
        src="/images/brand/logo-full-teal.png"
        alt="SolelyArt"
        className={`w-28 sm:w-32 lg:w-36 h-auto object-contain ${className}`}
        style={{ 
          minWidth: '100px', 
          maxWidth: '160px',
        }}
        loading="lazy"
      />
    </a>
  );
}

/**
 * BrandLogo - Generic brand logo component with variant support
 * For use in various contexts (loading screens, about pages, etc.)
 */
export function BrandLogo({ 
  variant = 'teal', 
  size = 'md',
  className = '' 
}: { 
  variant?: 'teal' | 'dark' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const logoMap = {
    teal: '/images/brand/logo-full-teal.png',
    dark: '/images/brand/logo-full-dark.png',
    light: '/images/brand/logo-full-light.png',
    white: '/images/brand/logo-full-white.png',
  };

  const sizeMap = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
  };

  return (
    <img
      src={logoMap[variant]}
      alt="SolelyArt"
      className={`object-contain ${sizeMap[size]} ${className}`}
    />
  );
}

export default ResponsiveLogo;
