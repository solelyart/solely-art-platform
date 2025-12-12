import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Search, Palette, Camera, Music, Hammer, Sparkles, Globe, Heart, Star } from "lucide-react";
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
    <div className="min-h-screen gradient-artistic">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Palette className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
              <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-gradient">Solely Art</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
              Browse Artists
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/10">
                  <Link href="/become-artist">Become an Artist</Link>
                </Button>
                <LogoutButton />
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="cursor-pointer transition-transform hover:scale-105"
                  aria-label="Go to dashboard"
                >
                  <UserAvatar photoUrl={user?.profilePhotoUrl} name={user?.name} size="sm" />
                </button>
              </>
            ) : (
              <Button size="sm" asChild className="gradient-hero text-white hover:opacity-90 transition-opacity">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Globe className="h-4 w-4" />
              <span>Connecting Artists Worldwide</span>
            </div>
            
            <h1 className="mb-6 text-6xl font-bold leading-tight md:text-7xl lg:text-8xl">
              Discover
              <br />
              <span className="text-gradient brush-underline">Creative Souls</span>
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
              A global marketplace where artistic passion meets opportunity.
              <br />
              From painters to photographers, musicians to muralists.
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto flex max-w-2xl gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for artists, services, or locations..."
                  className="h-14 pl-12 text-lg border-2 border-primary/20 focus:border-primary shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" asChild className="h-14 px-8 gradient-hero text-white hover:opacity-90 transition-opacity shadow-lg">
                <Link href={`/browse?q=${encodeURIComponent(searchTerm)}`}>
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">10k+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Explore by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Find the perfect artist for your creative project
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((category) => {
              const Icon = categoryIcons[category.slug] || Palette;
              return (
                <Link key={category.id} href={`/browse?category=${category.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                    <CardContent className="p-8 text-center">
                      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2 text-primary">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm font-medium uppercase tracking-wider">Featured</span>
              <Star className="h-5 w-5 fill-current" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Meet Our <span className="text-gradient">Top Artists</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Talented creators from around the world
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArtists?.slice(0, 6).map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                  {artist.portfolioImages && artist.portfolioImages.length > 0 ? (
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      <img
                        src={JSON.parse(artist.portfolioImages)[0]}
                        alt={artist.displayName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Palette className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {artist.displayName}
                    </h3>
                    {artist.location && (
                      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {artist.location}
                      </p>
                    )}
                    {artist.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {artist.bio}
                      </p>
                    )}
                    {artist.hourlyRate && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground">Starting at</span>
                        <span className="text-xl font-bold text-primary">
                          ${(artist.hourlyRate / 100).toFixed(0)}/hr
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {(!featuredArtists || featuredArtists.length === 0) && (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">
                No artists yet. Be the first to join our creative community!
              </p>
              <Button asChild className="mt-6 gradient-hero text-white">
                <Link href="/become-artist">Become an Artist</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Heart className="h-16 w-16 mx-auto mb-6 fill-current" />
            <h2 className="text-4xl font-bold mb-6 md:text-5xl">
              Join Our Global Creative Community
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Whether you're an artist looking to showcase your work or a client seeking creative talent, 
              Solely Art is your canvas for connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg h-14 px-8 shadow-xl">
                <Link href="/become-artist">Start Creating</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-xl">
                <Link href="/browse">Find Artists</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Solely Art</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting artists with opportunities worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Artists</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/become-artist" className="hover:text-primary transition-colors">Join as Artist</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Artists</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">My Bookings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Join our global community of creative professionals.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Solely Art. Empowering artists worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
