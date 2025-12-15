import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArtistCardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { trpc } from "@/lib/trpc";
import { Search, Palette, MapPin, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Browse() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedCategories: [] as string[],
    location: "",
    minPrice: 0,
    maxPrice: 500,
    availableNow: false,
  });

  // Parse URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters({
      searchTerm: params.get("q") || "",
      selectedCategories: params.get("categories")?.split(",").filter(Boolean) || [],
      location: params.get("location") || "",
      minPrice: parseInt(params.get("minPrice") || "0"),
      maxPrice: parseInt(params.get("maxPrice") || "500"),
      availableNow: params.get("available") === "true",
    });
  }, []);

  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: artists, isLoading: artistsLoading } = trpc.artists.search.useQuery({
    searchTerm: filters.searchTerm || undefined,
    category: filters.selectedCategories.length > 0 ? filters.selectedCategories[0] : undefined,
    location: filters.location || undefined,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("q", filters.searchTerm);
    if (filters.selectedCategories.length > 0) params.set("categories", filters.selectedCategories.join(","));
    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 500) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.availableNow) params.set("available", "true");
    
    setLocation(`/browse?${params.toString()}`);
  };

  const toggleCategory = (slug: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(slug)
        ? prev.selectedCategories.filter(c => c !== slug)
        : [...prev.selectedCategories, slug]
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategories: [],
      location: "",
      minPrice: 0,
      maxPrice: 500,
      availableNow: false,
    });
    setLocation("/browse");
  };

  const hasActiveFilters = filters.selectedCategories.length > 0 || 
    filters.location || 
    filters.minPrice > 0 || 
    filters.maxPrice < 500 || 
    filters.availableNow;

  // Filter artists by price range
  const filteredArtists = artists?.filter(artist => {
    if (!artist.hourlyRate) return true;
    const hourlyRate = artist.hourlyRate / 100;
    return hourlyRate >= filters.minPrice && hourlyRate <= filters.maxPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Palette className="h-9 w-9 text-primary transition-transform group-hover:scale-105" />
            <span className="text-2xl font-semibold tracking-tight">Solely Art</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
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
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-80 flex-shrink-0 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                    Clear All
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    data-testid="search-input"
                    placeholder="Search artists..."
                    className="pl-10"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Categories</Label>
                {categoriesLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="skeleton h-8 w-24 rounded-full" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories?.map((cat) => {
                      const isActive = filters.selectedCategories.includes(cat.slug);
                      return (
                        <Badge
                          key={cat.id}
                          variant={isActive ? "default" : "outline"}
                          className={`cursor-pointer transition-all hover-lift ${
                            isActive 
                              ? "bg-primary text-primary-foreground hover:bg-primary-hover" 
                              : "hover:border-primary hover:text-primary"
                          }`}
                          onClick={() => toggleCategory(cat.slug)}
                          data-testid="category-option"
                        >
                          {cat.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City or region"
                    className="pl-10"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label>Hourly Rate (${filters.minPrice} - ${filters.maxPrice})</Label>
                <Slider
                  min={0}
                  max={500}
                  step={10}
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="available" className="cursor-pointer">
                  Available Now
                </Label>
                <Switch
                  id="available"
                  checked={filters.availableNow}
                  onCheckedChange={(checked) => setFilters({ ...filters, availableNow: checked })}
                />
              </div>

              {/* Apply Filters Button */}
              <Button onClick={handleSearch} className="w-full btn-cta" data-testid="apply-filters" data-testid-alt="search-button">
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Discover Artists</h1>
                <p className="text-muted-foreground">
                  {artistsLoading ? (
                    "Loading..."
                  ) : (
                    `${filteredArtists?.length || 0} artist${filteredArtists?.length !== 1 ? "s" : ""} found`
                  )}
                </p>
              </div>
              
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {filters.selectedCategories.map(slug => {
                    const cat = categories?.find(c => c.slug === slug);
                    return cat ? (
                      <Badge key={slug} variant="secondary" className="gap-1">
                        {cat.name}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => toggleCategory(slug)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Artist Grid */}
            {artistsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <ArtistCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredArtists && filteredArtists.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="search-results">
                {filteredArtists.map((artist) => {
                  const portfolioImages = typeof artist.portfolioImages === 'string'
                    ? JSON.parse(artist.portfolioImages)
                    : (Array.isArray(artist.portfolioImages) ? artist.portfolioImages : []);
                  const firstImage = portfolioImages[0];
                  
                  return (
                    <Link key={artist.id} href={`/artist/${artist.id}`}>
                      <Card data-testid="artist-card" className="overflow-hidden hover-lift shadow-elegant">
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
                        <CardContent className="p-6">
                          <h3 className="mb-2 text-xl font-semibold">{artist.displayName}</h3>
                          {artist.location && (
                            <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {artist.location}
                            </p>
                          )}
                          {artist.bio && (
                            <p className="line-clamp-2 text-sm text-muted-foreground mb-4">{artist.bio}</p>
                          )}
                          {artist.hourlyRate && (
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-semibold text-primary">
                                ${(artist.hourlyRate / 100).toFixed(0)}
                              </span>
                              <span className="text-sm text-muted-foreground">/hour</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No Artists Found"
                description="We couldn't find any artists matching your criteria. Try adjusting your filters or search terms."
                action={hasActiveFilters ? {
                  label: "Clear Filters",
                  onClick: clearFilters
                } : undefined}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
