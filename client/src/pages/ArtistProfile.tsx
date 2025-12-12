import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MapPin, Star, Palette } from "lucide-react";
import { Link, useParams } from "wouter";

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id || "0");
  
  const { data: artist, isLoading } = trpc.artists.getById.useQuery({ id: artistId });
  const { data: reviews } = trpc.reviews.getByArtist.useQuery({ artistId });
  const { data: categories } = trpc.categories.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Artist Not Found</h2>
          <p className="mb-4 text-muted-foreground">The artist you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/browse">Browse Artists</Link>
          </Button>
        </div>
      </div>
    );
  }

  const artistCategories = categories?.filter(cat => 
    Array.isArray(artist.categories) && artist.categories.includes(cat.id)
  );

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
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Artist Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold">{artist.displayName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {artist.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{artist.location}</span>
                  </div>
                )}
                {artist.rating && artist.rating.count > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{artist.rating.average.toFixed(1)}</span>
                    <span>({artist.rating.count} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            {artist.bio && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{artist.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Portfolio */}
            {artist.portfolioImages && artist.portfolioImages.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {artist.portfolioImages.map((imageUrl: string, index: number) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg bg-muted">
                        <img
                          src={imageUrl}
                          alt={`Portfolio ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex">
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
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Artist</CardTitle>
              </CardHeader>
              <CardContent>
                {artist.hourlyRate && (
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-primary">
                      ${(artist.hourlyRate / 100).toFixed(0)}/hr
                    </p>
                  </div>
                )}
                <Button className="w-full" asChild>
                  <Link href={`/book/${artist.id}`}>Request Booking</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            {artistCategories && artistCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artistCategories.map((cat) => (
                      <span
                        key={cat.id}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
