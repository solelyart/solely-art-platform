import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Calendar, CheckCircle, Clock, XCircle, Palette } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: bookings, isLoading } = trpc.bookings.getMyBookings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: artistProfile } = trpc.artists.getMyProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateStatusMutation = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Booking status updated");
      utils.bookings.getMyBookings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update booking");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Please Sign In</h2>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    accepted: <CheckCircle className="h-4 w-4 text-green-500" />,
    declined: <XCircle className="h-4 w-4 text-red-500" />,
    completed: <CheckCircle className="h-4 w-4 text-blue-500" />,
    cancelled: <XCircle className="h-4 w-4 text-gray-500" />,
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Palette className="h-10 w-10 text-primary" />
            <span className="text-xl font-bold">Solely Art</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/browse" className="text-sm font-medium hover:text-primary">
              Browse Artists
            </Link>
            {!artistProfile && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/become-artist">Become an Artist</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "there"}!</p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            {artistProfile && <TabsTrigger value="profile">Artist Profile</TabsTrigger>}
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Loading bookings...</p>
                </CardContent>
              </Card>
            ) : bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {statusIcons[booking.status]}
                          <span className="font-semibold capitalize">{statusLabels[booking.status]}</span>
                        </div>
                        
                        <h3 className="mb-2 text-lg font-bold">{booking.serviceDescription}</h3>
                        
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.requestedDate).toLocaleDateString()}</span>
                        </div>
                        
                        {booking.budget && (
                          <p className="text-sm text-muted-foreground">
                            Budget: ${(booking.budget / 100).toFixed(2)}
                          </p>
                        )}
                        
                        {booking.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">{booking.notes}</p>
                        )}
                      </div>
                      
                      {artistProfile && booking.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: "accepted" })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: "declined" })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No bookings yet</h3>
                  <p className="text-muted-foreground">
                    {artistProfile 
                      ? "Your bookings will appear here once clients start booking your services."
                      : "Browse artists and make your first booking!"}
                  </p>
                  {!artistProfile && (
                    <Button className="mt-4" asChild>
                      <Link href="/browse">Browse Artists</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {artistProfile && (
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold">{artistProfile.displayName}</h2>
                  {artistProfile.bio && (
                    <p className="mb-4 text-muted-foreground">{artistProfile.bio}</p>
                  )}
                  {artistProfile.location && (
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Location:</span> {artistProfile.location}
                    </p>
                  )}
                  {artistProfile.hourlyRate && (
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Hourly Rate:</span> ${(artistProfile.hourlyRate / 100).toFixed(0)}/hr
                    </p>
                  )}
                  <div className="mt-4">
                    <Button asChild>
                      <Link href={`/artist/${artistProfile.id}`}>View Public Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
