import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProfileHeaderSkeleton, ServiceCardSkeleton, ReviewCardSkeleton } from "@/components/Skeleton";
import { NoPortfolioYet, NoServicesYet, NoReviewsYet } from "@/components/EmptyState";
import { PortfolioDisplay } from "@/components/PortfolioDisplay";
import { AvailabilityPreview } from "@/components/AvailabilityPreview";
import { trpc } from "@/lib/trpc";
import { MapPin, Star, Palette, Clock, DollarSign, Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";

function BookingSettingsCard({ artistId }: { artistId: number }) {
  const { data: settings } = trpc.availability.getSettingsByArtist.useQuery({ artistId });

  if (!settings) return null;

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Booking Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Advance Booking</p>
          <p className="text-sm text-muted-foreground">
            Book up to {settings.advanceBookingDays} days in advance
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Buffer Time</p>
          <p className="text-sm text-muted-foreground">
            {settings.bookingBufferMinutes} minutes between appointments
          </p>
        </div>
        {settings.cancellationPolicy && (
          <div>
            <p className="text-sm font-medium mb-1">Cancellation Policy</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.cancellationPolicy}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id || "0");
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const { data: artist, isLoading: artistLoading } = trpc.artists.getById.useQuery({ id: artistId });
  const { data: services, isLoading: servicesLoading } = trpc.services.getByArtist.useQuery({ artistId });
  const { data: reviews, isLoading: reviewsLoading } = trpc.reviews.getByArtist.useQuery({ artistId });
  const { data: categories } = trpc.categories.list.useQuery();

  if (artistLoading) {
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
        <div className="container py-8">
          <ProfileHeaderSkeleton />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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

  const artistCategories = categories?.filter(cat => 
    Array.isArray(artist.categories) && artist.categories.includes(cat.id)
  );

  const portfolioImages = typeof artist.portfolioImages === 'string'
    ? JSON.parse(artist.portfolioImages)
    : (Array.isArray(artist.portfolioImages) ? artist.portfolioImages : []);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : portfolioImages.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < portfolioImages.length - 1 ? selectedImageIndex + 1 : 0);
    }
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
          
          <nav className="flex items-center gap-6">
            <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Browse Artists
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      <div className="container py-8">
        {/* Artist Header */}
        <Card className="mb-8 shadow-elegant">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={undefined} alt={artist.displayName} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {artist.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 data-testid="artist-name" className="text-4xl font-bold mb-3">{artist.displayName}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
                  {artist.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{artist.location}</span>
                    </div>
                  )}
                  {artist.rating && artist.rating.count > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{artist.rating.average.toFixed(1)}</span>
                      <span>({artist.rating.count} reviews)</span>
                    </div>
                  )}
                  {artist.hourlyRate && (
                    <div className="flex items-center gap-2" data-testid="hourly-rate">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">${(artist.hourlyRate / 100).toFixed(0)}/hour</span>
                    </div>
                  )}
                </div>

                {artistCategories && artistCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {artistCategories.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {artist.bio && (
                  <p data-testid="artist-bio" className="text-muted-foreground leading-relaxed">{artist.bio}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="btn-cta" asChild data-testid="book-now-button">
                  <Link href={`/book/${artist.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Gallery */}
            <div data-testid="artist-portfolio">
              <PortfolioDisplay artistId={artistId} />
            </div>

            {/* Services */}
            <Card className="shadow-elegant" data-testid="artist-services">
              <CardHeader>
                <CardTitle className="text-2xl">Services</CardTitle>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <ServiceCardSkeleton key={i} />)}
                  </div>
                ) : services && services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service: any) => (
                      <Card key={service.id} className="shadow-hover hover-lift">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold">{service.name}</h3>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              ${(service.price / 100).toFixed(0)}
                            </Badge>
                          </div>
                          {service.description && (
                            <p className="text-muted-foreground mb-4">{service.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{service.durationMinutes} minutes</span>
                            </div>
                            <Button size="sm" className="btn-cta" asChild>
                              <Link href={`/book/${artist.id}?service=${service.id}`}>
                                Book This Service
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <NoServicesYet />
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="shadow-elegant" data-testid="artist-reviews">
              <CardHeader>
                <CardTitle className="text-2xl">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <ReviewCardSkeleton key={i} />)}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                                  U
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold">Anonymous</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoReviewsYet />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-elegant" data-testid="artist-pricing">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="font-semibold">Within 24h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Reviews</span>
                  <span className="font-semibold">{artist.rating?.count || 0}</span>
                </div>
                {artist.rating && artist.rating.count > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      {artist.rating.average.toFixed(1)}
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <div data-testid="artist-availability">
              <AvailabilityPreview artistId={artistId} />
            </div>
            
            {/* Booking Settings */}
            <BookingSettingsCard artistId={artistId} />

            {/* Contact Card */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ready to work with {artist.displayName}? Book a session or send a message.
                </p>
                <Button className="w-full btn-cta" asChild data-testid="view-availability">
                  <Link href={`/book/${artist.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Request Booking
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
