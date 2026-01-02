import { cn } from "@/lib/utils";

interface BrandLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

/**
 * BrandLoading - SolelyArt branded loading indicator
 * Uses the SLA monogram with a subtle pulse animation
 */
export function BrandLoading({ size = 'md', className = '', text }: BrandLoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" 
             style={{ animationDuration: '1s' }} />
        
        {/* SLA monogram in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['Cormorant_Garamond',Georgia,serif] text-primary font-medium"
                style={{ fontSize: size === 'sm' ? '10px' : size === 'md' ? '14px' : '18px' }}>
            SLA
          </span>
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * BrandLoadingOverlay - Full-screen loading overlay with brand elements
 */
export function BrandLoadingOverlay({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <img 
          src="/images/brand/logo-full-teal.png" 
          alt="SolelyArt" 
          className="h-16 w-auto animate-pulse"
        />
        <BrandLoading size="lg" />
        <p className="text-muted-foreground font-['Cormorant_Garamond',Georgia,serif] text-lg tracking-wide">
          {text}
        </p>
      </div>
    </div>
  );
}

/**
 * BrandSkeleton - Skeleton loader with brand styling
 */
export function BrandSkeleton({ 
  className = '',
  variant = 'text'
}: { 
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div 
      className={cn(
        "skeleton",
        variantClasses[variant],
        className
      )}
    />
  );
}

/**
 * BrandCardSkeleton - Skeleton for artist/service cards
 */
export function BrandCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(51,51,51,0.05),0_2px_8px_rgba(51,51,51,0.04)]">
      {/* Image skeleton */}
      <BrandSkeleton variant="rectangular" className="aspect-[4/3] w-full" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <BrandSkeleton className="h-6 w-3/4" />
        <BrandSkeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <BrandSkeleton className="h-6 w-16 rounded-full" />
          <BrandSkeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * BrandPageSkeleton - Full page skeleton with header
 */
export function BrandPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-20 border-b border-border/50 flex items-center justify-between px-6">
        <BrandSkeleton className="h-10 w-32" />
        <div className="flex gap-4">
          <BrandSkeleton className="h-8 w-24" />
          <BrandSkeleton className="h-8 w-24" />
          <BrandSkeleton className="h-8 w-24" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <BrandSkeleton className="h-12 w-2/3 mx-auto" />
          <BrandSkeleton className="h-6 w-1/2 mx-auto" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <BrandCardSkeleton />
            <BrandCardSkeleton />
            <BrandCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandLoading;
