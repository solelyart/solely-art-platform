import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="btn-cta">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Specific empty states for common scenarios
export function NoArtistsFound() {
  return (
    <EmptyState
      icon={require("lucide-react").Search}
      title="No Artists Found"
      description="We couldn't find any artists matching your criteria. Try adjusting your filters or search terms."
    />
  );
}

export function NoServicesYet() {
  return (
    <EmptyState
      icon={require("lucide-react").Briefcase}
      title="No Services Yet"
      description="This artist hasn't added any services yet. Check back soon!"
    />
  );
}

export function NoBookingsYet() {
  return (
    <EmptyState
      icon={require("lucide-react").Calendar}
      title="No Bookings Yet"
      description="You don't have any bookings yet. Browse artists and book your first session!"
    />
  );
}

export function NoReviewsYet() {
  return (
    <EmptyState
      icon={require("lucide-react").Star}
      title="No Reviews Yet"
      description="This artist hasn't received any reviews yet. Be the first to book and leave a review!"
    />
  );
}

export function NoPortfolioYet() {
  return (
    <EmptyState
      icon={require("lucide-react").Image}
      title="No Portfolio Images"
      description="This artist hasn't uploaded any portfolio images yet."
    />
  );
}

export function NoAvailability() {
  return (
    <EmptyState
      icon={require("lucide-react").CalendarX}
      title="No Availability Set"
      description="This artist hasn't set their availability yet. Please check back later or contact them directly."
    />
  );
}
