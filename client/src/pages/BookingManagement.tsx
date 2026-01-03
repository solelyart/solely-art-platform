import { useState, useMemo } from "react";
import { ReviewPrompt } from "@/components/ReviewPrompt";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter,
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  Ban
} from "lucide-react";


type BookingStatus = "pending" | "accepted" | "declined" | "cancelled" | "completed";

export function BookingManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | BookingStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Get artist profile to check if user is an artist
  const { data: profile } = trpc.artists.getMyProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Fetch bookings (combines artist and client bookings)
  const { data: bookings, isLoading } = trpc.bookings.getMyBookings.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Fetch reviews to check which bookings have been reviewed
  const { data: myReviews } = trpc.reviews.getMyReviews.useQuery(
    undefined,
    { enabled: !!user && !profile }
  );

  // Update booking status mutation
  const updateStatus = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => {
      trpc.useUtils().bookings.getMyBookings.invalidate();
    },
  });

  // Cancel booking using updateStatus
  const cancelBooking = (bookingId: number, reason: string) => {
    updateStatus.mutate({ bookingId, status: "cancelled" });
  };

  // Filter bookings
  const allBookings = useMemo(() => {
    if (!bookings) return [];
    
    const uniqueBookings = bookings;

    // Apply filters
    let filtered = uniqueBookings;

    // Status filter
    if (activeTab !== "all") {
      filtered = filtered.filter(b => b.status === activeTab);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.serviceDescription?.toLowerCase().includes(query) ||
        b.notes?.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter.start) {
      filtered = filtered.filter(b => 
        new Date(b.requestedDate) >= new Date(dateFilter.start)
      );
    }
    if (dateFilter.end) {
      filtered = filtered.filter(b => 
        new Date(b.requestedDate) <= new Date(dateFilter.end)
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime()
    );
  }, [bookings, activeTab, searchQuery, dateFilter]);

  // Count by status
  const statusCounts = useMemo(() => {
    if (!bookings) return { all: 0, pending: 0, accepted: 0, declined: 0, cancelled: 0, completed: 0 };
    
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
      accepted: bookings.filter(b => b.status === "accepted").length,
      declined: bookings.filter(b => b.status === "declined").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
      completed: bookings.filter(b => b.status === "completed").length,
    };
  }, [bookings]);

  const handleAccept = (bookingId: number) => {
    if (confirm("Accept this booking request?")) {
      updateStatus.mutate({ bookingId, status: "accepted" });
    }
  };

  const handleDecline = (bookingId: number) => {
    if (confirm("Decline this booking request? This cannot be undone.")) {
      updateStatus.mutate({ bookingId, status: "declined" });
    }
  };

  const handleCancel = (bookingId: number) => {
    const reason = prompt("Please provide a cancellation reason:");
    if (reason) {
      cancelBooking(bookingId, reason);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const badges = {
      pending: { icon: AlertCircle, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Pending" },
      accepted: { icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200", label: "Accepted" },
      declined: { icon: XCircle, color: "text-gray-600 bg-gray-50 border-gray-200", label: "Declined" },
      cancelled: { icon: XCircle, color: "text-red-600 bg-red-50 border-red-200", label: "Cancelled" },
      completed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50 border-blue-200", label: "Completed" },
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  // isLoading already defined above

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container max-w-6xl py-8">
        {/* Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Management</h1>
        <p className="text-muted-foreground">
          View and manage your bookings {profile && "as an artist"} and client.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              className="w-40"
            />
            <Input
              type="date"
              placeholder="End date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({statusCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="declined" className="hidden lg:flex">
            Declined ({statusCounts.declined})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({statusCounts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {allBookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "all" 
                  ? "You don't have any bookings yet."
                  : `No ${activeTab} bookings found.`}
              </p>
            </Card>
          ) : (
            allBookings.map((booking) => {
              const isArtist = profile && booking.artistId === profile.id;
              const bookingDate = new Date(booking.requestedDate);
              
              return (
                <Card key={booking.id} className="p-6" data-testid="booking-card">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        {getStatusBadge(booking.status as BookingStatus)}
                        {isArtist && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            As Artist
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">
                        {booking.serviceDescription || "Booking Request"}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {bookingDate.toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {bookingDate.toLocaleTimeString('en-US', { 
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {booking.budget && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Budget:</span>
                            <span>${booking.budget}</span>
                          </div>
                        )}
                        {booking.notes && (
                          <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {isArtist && booking.status === "pending" && (
                        <>
                          <Button
                            data-testid="accept-booking"
                            size="sm"
                            onClick={() => handleAccept(booking.id)}
                            disabled={updateStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            data-testid="decline-booking"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecline(booking.id)}
                            disabled={updateStatus.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {!isArtist && (booking.status === "pending" || booking.status === "accepted") && (
                        <Button
                          data-testid="cancel-booking"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={updateStatus.isPending}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}

                      {booking.status === "accepted" && isArtist && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus.mutate({ bookingId: booking.id, status: "completed" })}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Review Prompt for Completed Bookings (Client Side) */}
                  {!isArtist && booking.status === "completed" && !myReviews?.some((r: any) => r.bookingId === booking.id) && (
                    <div className="mt-4 pt-4 border-t">
                      <ReviewPrompt
                        bookingId={booking.id}
                        artistId={booking.artistId}
                        artistName="the artist"
                        onReviewSubmitted={() => {
                          trpc.useUtils().bookings.getMyBookings.invalidate();
                        }}
                      />
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
