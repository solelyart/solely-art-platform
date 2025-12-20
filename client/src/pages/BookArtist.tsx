import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Palette, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
// Toast functionality to be added later

export default function BookArtist() {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id || "0");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  // const { toast } = useToast(); // To be implemented

  const [step, setStep] = useState<'service' | 'calendar' | 'details' | 'confirm'>('service');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const { data: artist, isLoading: artistLoading } = trpc.artists.getById.useQuery({ id: artistId });
  const { data: services, isLoading: servicesLoading } = trpc.services.getByArtist.useQuery({ artistId });
  
  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: () => {
      setStep('confirm');
      // Success handled by step change
    },
    onError: (error) => {
      console.error("Booking failed:", error);
      alert(error.message || "Something went wrong. Please try again.");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              You need to be signed in to book an artist.
            </p>
            <Button asChild className="w-full btn-cta">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/artist/${artistId}`}>Back to Artist Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (artistLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
          <div className="container flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/brand/logo-circle-text.svg" 
                alt="Solely Art" 
                className="h-12 w-auto transition-transform group-hover:scale-105" 
              />
            </Link>
          </div>
        </header>
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Palette className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Artist Not Found</h2>
          <p className="mb-4 text-muted-foreground">The artist you're looking for doesn't exist.</p>
          <Button asChild className="btn-cta">
            <Link href="/browse">Browse Artists</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep('calendar');
  };

  const handleSlotSelect = (date: string, startTime: string, endTime: string) => {
    setSelectedDate(date);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setStep('details');
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedStartTime) {
      alert("Please complete all required fields.");
      return;
    }

    // Combine date and time into ISO datetime
    const requestedDateTime = new Date(`${selectedDate}T${selectedStartTime}:00`);

    await createBooking.mutateAsync({
      artistId,
      serviceDescription: selectedService.name,
      requestedDate: requestedDateTime,
      budget: budget ? parseFloat(budget) * 100 : undefined,
      notes: notes || undefined,
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/brand/logo-circle-text.svg" 
              alt="Solely Art" 
              className="h-12 w-auto transition-transform group-hover:scale-105" 
            />
          </Link>
          
          <Button variant="ghost" asChild>
            <Link href={`/artist/${artistId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>
      </header>

      <div className="container py-8 max-w-6xl">
        {/* Artist Info Banner */}
        <Card className="mb-8 shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {artist.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{artist.displayName}</h1>
                <p className="text-muted-foreground">Complete your booking in a few simple steps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[
            { key: 'service', label: 'Select Service' },
            { key: 'calendar', label: 'Choose Time' },
            { key: 'details', label: 'Add Details' },
            { key: 'confirm', label: 'Confirm' },
          ].map((s, index) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium
                  ${step === s.key
                    ? 'bg-primary text-primary-foreground'
                    : ['service', 'calendar', 'details', 'confirm'].indexOf(step) > index
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">{s.label}</span>
              {index < 3 && <div className="mx-4 h-0.5 w-8 bg-border hidden md:block" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 'service' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
            {services && services.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service: any) => (
                  <Card
                    key={service.id}
                    data-testid="service-card"
                    className="cursor-pointer hover-lift shadow-hover transition-all"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold">{service.name}</h3>
                        <span className="text-lg font-bold text-primary">
                          ${(service.price / 100).toFixed(0)}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{service.durationMinutes} minutes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">This artist hasn't added any services yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 'calendar' && selectedService && (
          <div>
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setStep('service')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Service
              </Button>
              <h2 className="text-2xl font-bold mt-4">Choose Your Time</h2>
              <p className="text-muted-foreground mt-2">
                Booking: <span className="font-semibold text-foreground">{selectedService.name}</span> ({selectedService.durationMinutes} min)
              </p>
            </div>
            <BookingCalendar
              data-testid="availability-calendar"
              artistId={artistId}
              serviceDuration={selectedService.durationMinutes}
              onSlotSelect={handleSlotSelect}
            />
          </div>
        )}

        {step === 'details' && (
          <div>
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setStep('calendar')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Time
              </Button>
              <h2 className="text-2xl font-bold mt-4">Add Booking Details</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      data-testid="budget-input"
                      id="budget"
                      type="number"
                      placeholder="Enter your budget in dollars"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Let the artist know your budget for this project
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Requests or Notes</Label>
                    <Textarea
                      data-testid="special-requests"
                      id="notes"
                      placeholder="Any specific requirements, questions, or details the artist should know..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="booking-summary">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div data-testid="summary-service">
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-semibold">{selectedService?.name}</p>
                  </div>
                  <div data-testid="summary-date">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div data-testid="summary-time">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">
                      {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
                    </p>
                  </div>
                  <div data-testid="summary-duration">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{selectedService?.durationMinutes} minutes</p>
                  </div>
                  <div className="pt-4 border-t" data-testid="summary-total">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(selectedService?.price / 100).toFixed(0)}
                    </p>
                  </div>
                  <Button
                    data-testid="confirm-booking"
                    onClick={handleSubmitBooking}
                    disabled={createBooking.isPending}
                    className="w-full btn-cta"
                    size="lg"
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <Card className="max-w-2xl mx-auto" data-testid="confirmation-message">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Booking Request Sent!</h2>
              <p className="text-muted-foreground mb-8">
                {artist.displayName} will review your booking request and respond soon. You can track the status in your dashboard.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild className="btn-cta">
                  <Link href="/browse">Browse More Artists</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
