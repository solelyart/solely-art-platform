import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Search, Palette, Camera, Music, Hammer } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { UserAvatar } from "@/components/UserAvatar";
import { LogoutButton } from "@/components/LogoutButton";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: featuredArtists } = trpc.artists.list.useQuery();

  const categoryIcons: Record<string, any> = {
    "painting-drawing": Palette,
    "photography": Camera,
    "music-performance": Music,
    "crafts-handmade": Hammer,
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
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/become-artist">Become an Artist</Link>
                </Button>
                <LogoutButton />
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="cursor-pointer"
                  aria-label="Go to dashboard"
                >
                  <UserAvatar photoUrl={user?.profilePhotoUrl} name={user?.name} size="sm" />
                </button>
              </>
            ) : (
              <Button size="sm" asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Connect with Local
              <br />
              <span className="text-primary">Creative Talent</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Discover and book talented artists and creative professionals in your community. 
              From painters to photographers, musicians to muralists.
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto flex max-w-xl gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for artists, services, or locations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button asChild>
                <Link href={`/browse?q=${encodeURIComponent(searchTerm)}`}>Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {categories?.slice(0, 8).map((category) => {
              const Icon = categoryIcons[category.slug] || Palette;
              return (
                <Link key={category.id} href={`/browse?category=${category.slug}`}>
                  <Card className="transition-all hover:border-primary hover:shadow-md">
                    <CardContent className="flex flex-col items-center gap-3 p-6">
                      <div className="rounded-full bg-primary/10 p-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-center font-semibold">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="bg-secondary py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Artists</h2>
            <Button variant="outline" asChild>
              <Link href="/browse">View All</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArtists?.slice(0, 6).map((artist) => {
              const portfolioImages = Array.isArray(artist.portfolioImages) 
                ? artist.portfolioImages 
                : [];
              const firstImage = portfolioImages[0];
              
              return (
                <Link key={artist.id} href={`/artist/${artist.id}`}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={artist.displayName}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Palette className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-1 font-bold">{artist.displayName}</h3>
                        {artist.location && (
                          <p className="mb-2 text-sm text-muted-foreground">{artist.location}</p>
                        )}
                        {artist.bio && (
                          <p className="line-clamp-2 text-sm text-muted-foreground">{artist.bio}</p>
                        )}
                      </CardContent>
                    </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Are You a Creative Professional?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join our community of artists and connect with clients who value your work. 
              No subscription fees, just a simple 10% commission on bookings.
            </p>
            <Button size="lg" asChild>
              {isAuthenticated ? (
                <Link href="/become-artist">Create Your Artist Profile</Link>
              ) : (
                <a href={getLoginUrl()}>Get Started</a>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Solely Art. Supporting local creativity.</p>
        </div>
      </footer>
    </div>
  );
}
