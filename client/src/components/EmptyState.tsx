import { Button } from "@/components/ui/button";
import { 
  Search,
  Briefcase,
  Calendar,
  Star,
  Image,
  CalendarX,
  LucideIcon 
} from "lucide-react";

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
      icon={Search}
      title="No Artists Found"
      description="We couldn't find any artists matching your criteria. Try adjusting your filters or search terms."
    />
  );
}

export function NoServicesYet() {
  return (
    <EmptyState
      icon={Briefcase}
      title="No Services Yet"
      description="This artist hasn't added any services yet. Check back soon!"
    />
  );
}

export function NoBookingsYet() {
  return (
    <EmptyState
      icon={Calendar}
      title="No Bookings Yet"
      description="You don't have any bookings yet. Browse artists and book your first session!"
    />
  );
}

export function NoReviewsYet() {
  return (
    <EmptyState
      icon={Star}
      title="No Reviews Yet"
      description="This artist hasn't received any reviews yet. Be the first to book and leave a review!"
    />
  );
}

export function NoPortfolioYet() {
  return (
    <EmptyState
      icon={Image}
      title="No Portfolio Images"
      description="This artist hasn't uploaded any portfolio images yet."
    />
  );
}

export function NoAvailability() {
  return (
    <EmptyState
      icon={CalendarX}
      title="No Availability Set"
      description="This artist hasn't set their availability yet. Please check back later or contact them directly."
    />
  );
}
