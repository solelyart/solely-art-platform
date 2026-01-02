import { User } from "lucide-react";

interface UserAvatarProps {
  photoUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
  xl: "w-24 h-24 text-lg",
};

export function UserAvatar({ photoUrl, name, size = "md", className = "" }: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name || "User"}
        className={`${sizeClass} rounded-full object-cover border-2 border-border ${className}`}
      />
    );
  }

  // Default avatar with initials or icon
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <div
      className={`${sizeClass} rounded-full bg-primary/10 flex items-center justify-center border-2 border-border ${className}`}
    >
      {initials ? (
        <span className="font-semibold text-primary">{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-primary/50" />
      )}
    </div>
  );
}
