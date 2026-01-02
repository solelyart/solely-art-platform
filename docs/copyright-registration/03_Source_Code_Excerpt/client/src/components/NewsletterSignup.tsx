import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export function NewsletterSignup({ variant = "default", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setIsSubscribed(true);
      setEmail("");
      toast.success(data.alreadySubscribed ? "Already Subscribed" : "Successfully Subscribed!", {
        description: data.message,
      });
    },
    onError: (error) => {
      toast.error("Subscription Failed", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    subscribeMutation.mutate({ email, source: "footer" });
  };

  const isLoading = subscribeMutation.isPending;

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-2 text-primary ${className}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-background/50 border-border/50"
          disabled={isLoading}
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 max-w-md ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    );
  }

  // Default variant - full featured
  return (
    <div className={className}>
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Stay Updated</h3>
      <p className="text-sm text-foreground/60 font-light mb-4">
        Get the latest artist spotlights and platform updates delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="shrink-0">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
      <p className="text-xs text-foreground/40 mt-2">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
