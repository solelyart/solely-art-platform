import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Search, Palette, Camera, Music, Hammer, Award, Globe, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { UserAvatar } from "@/components/UserAvatar";
import { LogoutButton } from "@/components/LogoutButton";
import { NewsletterSignup } from "@/components/NewsletterSignup";

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
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/brand/logo-circle-text.svg" 
              alt="Solely Art" 
              className="h-16 w-auto transition-transform group-hover:scale-105" 
            />
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="search-link">
              Browse Artists
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="nav-dashboard">
                  Dashboard
                </Link>
                       <Link href="/availability" className="text-foreground/80 hover:text-foreground transition-colors">
                Availability
              </Link>
              <Link href="/bookings" className="text-foreground/80 hover:text-foreground transition-colors">
                Bookings
              </Link>
              <Link href="/messages" className="text-foreground/80 hover:text-foreground transition-colors">
                Messages
              </Link>
                <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/5" data-testid="nav-become-artist">
                  <Link href="/become-artist">Become an Artist</Link>
                </Button>
                <LogoutButton />
                <button
                  data-testid="user-menu"
                  onClick={() => window.location.href = '/dashboard'}
                  className="cursor-pointer transition-transform hover:scale-105"
                  aria-label="Go to dashboard"
                >
                  <UserAvatar photoUrl={user?.profilePhotoUrl} name={user?.name} size="sm" />
                </button>
              </>
            ) : (
              <Button size="sm" asChild className="gradient-hero text-white hover:opacity-90 transition-opacity" data-testid="login-button">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 md:py-40 texture-overlay">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-32 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/50 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Globe className="h-4 w-4" />
              <span>Curated Global Talent</span>
            </div>
            
            <h1 data-testid="hero-title" className="mb-8 text-6xl font-semibold leading-[1.1] md:text-7xl lg:text-8xl">
              Discover
              <br />
              <span className="text-gradient">Exceptional Artists</span>
            </h1>
            
            <p className="mb-12 text-xl text-foreground/70 md:text-2xl font-light leading-relaxed">
              A refined marketplace connecting discerning clients with world-class creative talent.
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto flex max-w-2xl gap-3 mb-16">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  data-testid="search-input"
                  placeholder="Search artists, services, or locations..."
                  className="h-16 pl-14 text-base border-2 border-border/50 focus:border-primary/50 shadow-elegant bg-card/80 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" asChild className="h-16 px-10 gradient-hero text-white hover:opacity-90 transition-opacity shadow-elegant" data-testid="search-button">
                <Link href={`/browse?q=${encodeURIComponent(searchTerm)}`}>
                  Search
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-5xl font-semibold text-primary mb-3">1,000+</div>
                <div className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Curated Artists</div>
              </div>
              <div className="text-center border-x border-border/50">
                <div className="text-5xl font-semibold text-accent mb-3">50+</div>
                <div className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-semibold text-secondary mb-3">10,000+</div>
                <div className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 text-primary/80">
              <div className="h-px w-8 bg-primary/30"></div>
              <span className="text-sm font-medium uppercase tracking-widest">Categories</span>
              <div className="h-px w-8 bg-primary/30"></div>
            </div>
            <h2 className="text-5xl font-semibold mb-6">
              Explore by <span className="text-gradient">Discipline</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto">
              Each category features hand-selected artists renowned for their exceptional craft
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((category) => {
              const Icon = categoryIcons[category.slug] || Palette;
              return (
                <Link key={category.id} href={`/browse?category=${category.slug}`}>
                  <Card data-testid="category-card" className="group hover-lift border-border/50 bg-card/80 backdrop-blur-sm shadow-elegant">
                    <CardContent className="p-10 text-center">
                      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-foreground/60 font-light leading-relaxed">
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
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-3 text-primary">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-widest">Featured</span>
            </div>
            <h2 className="text-5xl font-semibold mb-6">
              Distinguished <span className="text-gradient">Creators</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto">
              Meet the exceptional artists shaping creative excellence worldwide
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArtists?.slice(0, 6).map((artist) => {
              const portfolioImages = typeof artist.portfolioImages === 'string' 
                ? JSON.parse(artist.portfolioImages) 
                : artist.portfolioImages || [];
              
              return (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <Card data-testid="featured-artist-card" className="group overflow-hidden hover-lift border-border/50 bg-card/80 backdrop-blur-sm shadow-elegant">
                  {portfolioImages && portfolioImages.length > 0 ? (
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      <img
                        src={portfolioImages[0]}
                        alt={artist.displayName}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
                          {artist.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <Palette className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {artist.displayName}
                    </h3>
                    {artist.location && (
                      <p className="text-sm text-foreground/60 mb-4 flex items-center gap-2 font-light">
                        <Globe className="h-4 w-4" />
                        {artist.location}
                      </p>
                    )}
                    {artist.bio && (
                      <p className="text-sm text-foreground/60 line-clamp-2 mb-6 font-light leading-relaxed">
                        {artist.bio}
                      </p>
                    )}
                    {artist.hourlyRate && (
                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <span className="text-sm text-foreground/50 font-light">Starting from</span>
                        <span className="text-2xl font-semibold text-primary">
                          ${(artist.hourlyRate / 100).toFixed(0)}/hr
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
            })}
          </div>
          
          {(!featuredArtists || featuredArtists.length === 0) && (
            <div className="text-center py-20">
              <img 
                src="/brand/logo-diamond-icon.svg" 
                alt="Solely Art" 
                className="h-20 w-20 mx-auto mb-6 opacity-30" 
              />
              <p className="text-lg text-foreground/60 font-light mb-8">
                Be among the first to join our curated community of exceptional artists
              </p>
              <Button asChild size="lg" className="gradient-hero text-white shadow-elegant">
                <Link href="/become-artist">Apply as an Artist</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-card/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto">
              Hear from clients who have found their perfect creative match through Solely Art
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Working with Elena was an absolute dream. She captured the essence of our brand in ways we never imagined possible. The abstract piece she created is now the centerpiece of our office.",
                author: "Sarah Mitchell",
                role: "Creative Director, Luxe Interiors",
                rating: 5
              },
              {
                quote: "Marcus's photography transformed our product launch. His attention to detail and artistic vision elevated our entire campaign. We've already booked him for our next three projects.",
                author: "David Chen",
                role: "Marketing VP, Artisan Collective",
                rating: 5
              },
              {
                quote: "The wedding invitation suite Oliver created was beyond our expectations. Every guest commented on the beautiful calligraphy. It set the perfect tone for our special day.",
                author: "Emma & James Thompson",
                role: "Newlyweds, Boston",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-elegant hover-lift">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Award key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-foreground/50">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full texture-overlay"></div>
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center text-white">
            <TrendingUp className="h-16 w-16 mx-auto mb-8 opacity-90" />
            <h2 className="text-5xl font-semibold mb-8 md:text-6xl">
              Elevate Your Creative Vision
            </h2>
            <p className="text-xl mb-12 opacity-90 font-light leading-relaxed">
              Join a distinguished community where exceptional artistry meets discerning clientele. 
              Whether showcasing your portfolio or commissioning bespoke work, Solely Art is your gateway to excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg h-16 px-10 shadow-elegant hover:shadow-2xl transition-all">
                <Link href="/become-artist">Apply as Artist</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-16 px-10 bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-elegant hover:shadow-2xl transition-all backdrop-blur-sm">
                <Link href="/browse">Explore Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-16">
        <div className="container">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
              <div className="mb-6">
                <img 
                  src="/brand/logo-circle-full.svg" 
                  alt="Solely Art - Curated Connections" 
                  className="h-24 w-auto" 
                />
              </div>
              <p className="text-sm text-foreground/60 font-light leading-relaxed">
                Curating exceptional creative talent for discerning clients worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">For Artists</h3>
              <ul className="space-y-3 text-sm text-foreground/60 font-light">
                <li><Link href="/become-artist" className="hover:text-primary transition-colors">Join as Artist</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">For Clients</h3>
              <ul className="space-y-3 text-sm text-foreground/60 font-light">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Artists</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">My Commissions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-3 text-sm text-foreground/60 font-light">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mb-12 pt-8 border-t border-border/50">
            <div className="max-w-xl mx-auto text-center">
              <h3 className="font-semibold mb-3 text-lg">Join Our Community</h3>
              <p className="text-sm text-foreground/60 font-light mb-4">
                Get the latest artist spotlights, creative inspiration, and platform updates delivered to your inbox.
              </p>
              <NewsletterSignup variant="inline" className="justify-center" />
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-foreground/50 font-light">
            <p>© 2025 Solely Art. All Rights Reserved.</p>
            <p className="mt-1">Solely Art™ is a trademark of Solely Art.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
