import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Redirect to home page after logout
      window.location.href = "/";
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
