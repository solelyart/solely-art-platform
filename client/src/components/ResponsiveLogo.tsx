import { useState, useEffect } from 'react';

interface ResponsiveLogoProps {
  variant?: 'header' | 'footer' | 'hero';
  className?: string;
  linkTo?: string;
}

/**
 * ResponsiveLogo - Automatically swaps logo variants based on screen size
 * 
 * Breakpoints:
 * - Mobile (< 640px): Icon only, 32px
 * - Tablet (640-1023px): Icon only, 40px  
 * - Desktop (1024px+): Full logo or icon based on variant
 * 
 * Uses srcset for retina displays (1x, 2x, 3x)
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
      // Header always uses icon for cleaner nav
      return {
        src: '/brand/sla-icon-1x.png',
        srcSet: '/brand/sla-icon-1x.png 1x, /brand/sla-icon-2x.png 2x, /brand/sla-icon-3x.png 3x',
        alt: 'Solely Art',
        height: screenSize === 'mobile' ? 32 : 40,
        width: screenSize === 'mobile' ? 37 : 46,
      };
    }
    
    if (variant === 'footer') {
      // Footer uses full logo on desktop/tablet, icon on mobile
      if (screenSize === 'mobile') {
        return {
          src: '/brand/sla-mobile-icon.png',
          srcSet: '/brand/sla-mobile-icon.png 1x, /brand/sla-mobile-icon-2x.png 2x',
          alt: 'Solely Art',
          height: 48,
          width: 48,
        };
      }
      return {
        src: '/brand/sla-full-1x.png',
        srcSet: '/brand/sla-full-1x.png 1x, /brand/sla-full-2x.png 2x, /brand/sla-full-3x.png 3x',
        alt: 'Solely Art',
        width: screenSize === 'tablet' ? 150 : 180,
        height: screenSize === 'tablet' ? 65 : 78,
      };
    }
    
    if (variant === 'hero') {
      // Hero uses larger full logo
      if (screenSize === 'mobile') {
        return {
          src: '/brand/sla-full-1x.png',
          srcSet: '/brand/sla-full-1x.png 1x, /brand/sla-full-2x.png 2x',
          alt: 'Solely Art',
          width: 200,
          height: 87,
        };
      }
      return {
        src: '/brand/sla-full-2x.png',
        srcSet: '/brand/sla-full-2x.png 1x, /brand/sla-full-3x.png 2x',
        alt: 'Solely Art',
        width: screenSize === 'tablet' ? 280 : 360,
        height: screenSize === 'tablet' ? 121 : 156,
      };
    }

    // Default fallback
    return {
      src: '/brand/sla-icon-1x.png',
      srcSet: '/brand/sla-icon-1x.png 1x, /brand/sla-icon-2x.png 2x',
      alt: 'Solely Art',
      height: 40,
      width: 46,
    };
  };

  const config = getLogoConfig();

  const logoImage = (
    <img
      src={config.src}
      srcSet={config.srcSet}
      alt={config.alt}
      width={config.width}
      height={config.height}
      className={`object-contain ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
        aspectRatio: `${config.width} / ${config.height}`,
      }}
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
 * Uses icon-only variant with proper sizing constraints
 */
export function HeaderLogo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className="flex items-center shrink-0">
      <picture>
        {/* Mobile: smaller icon */}
        <source
          media="(max-width: 639px)"
          srcSet="/brand/sla-mobile-icon.png 1x, /brand/sla-mobile-icon-2x.png 2x"
        />
        {/* Tablet and up: standard icon */}
        <source
          media="(min-width: 640px)"
          srcSet="/brand/sla-icon-1x.png 1x, /brand/sla-icon-2x.png 2x, /brand/sla-icon-3x.png 3x"
        />
        <img
          src="/brand/sla-icon-1x.png"
          alt="Solely Art"
          className={`h-8 sm:h-10 w-auto object-contain ${className}`}
          style={{ minWidth: '32px', maxWidth: '60px' }}
        />
      </picture>
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
      <picture>
        {/* Mobile: compact icon */}
        <source
          media="(max-width: 639px)"
          srcSet="/brand/sla-full-1x.png 1x, /brand/sla-full-2x.png 2x"
        />
        {/* Tablet: medium full logo */}
        <source
          media="(min-width: 640px) and (max-width: 1023px)"
          srcSet="/brand/sla-full-1x.png 1x, /brand/sla-full-2x.png 2x"
        />
        {/* Desktop: large full logo */}
        <source
          media="(min-width: 1024px)"
          srcSet="/brand/sla-full-2x.png 1x, /brand/sla-full-3x.png 2x"
        />
        <img
          src="/brand/sla-full-1x.png"
          alt="Solely Art"
          className={`w-32 sm:w-40 lg:w-44 h-auto object-contain ${className}`}
          style={{ 
            minWidth: '120px', 
            maxWidth: '200px',
            aspectRatio: '180 / 78'
          }}
        />
      </picture>
    </a>
  );
}

export default ResponsiveLogo;
