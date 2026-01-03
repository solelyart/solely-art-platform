import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Settings, Loader2 } from "lucide-react";
import { WeeklyScheduleEditor } from "@/components/WeeklyScheduleEditor";
import { BlackoutCalendar } from "@/components/BlackoutCalendar";
import { BookingPolicySelector } from "@/components/BookingPolicySelector";


export function AvailabilityDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("schedule");

  // Get artist profile
  const { data: profile, isLoading: profileLoading } = trpc.artists.getMyProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Get artist settings
  const { data: settings, isLoading: settingsLoading } = trpc.availability.getSettings.useQuery(
    undefined,
    { enabled: !!profile }
  );

  if (profileLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Artist Profile Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to create an artist profile before managing your availability.
          </p>
          <Button asChild>
            <a href="/become-artist">Create Artist Profile</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Availability Management</h1>
        <p className="text-muted-foreground">
          Configure your schedule, blackout dates, and booking policies to control when clients can book you.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Weekly Schedule</span>
            <span className="sm:hidden">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="blackout" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Blackout Dates</span>
            <span className="sm:hidden">Blackout</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Booking Policies</span>
            <span className="sm:hidden">Policies</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Weekly Schedule</h2>
              <p className="text-sm text-muted-foreground">
                Set your regular weekly availability. Clients can only book during these time slots.
              </p>
            </div>
            <WeeklyScheduleEditor artistId={profile.id} />
          </Card>
        </TabsContent>

        <TabsContent value="blackout" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Blackout Dates</h2>
              <p className="text-sm text-muted-foreground">
                Block specific dates when you're unavailable (vacations, holidays, personal time).
              </p>
            </div>
            <BlackoutCalendar artistId={profile.id} />
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Booking Policies</h2>
              <p className="text-sm text-muted-foreground">
                Configure booking buffer times, advance booking limits, and cancellation policies.
              </p>
            </div>
            <BookingPolicySelector 
              artistId={profile.id} 
              currentSettings={settings || undefined}
            />
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
