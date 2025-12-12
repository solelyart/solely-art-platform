import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Search, Palette, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Browse() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    category: "",
    location: "",
  });

  // Parse URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams({
      searchTerm: params.get("q") || "",
      category: params.get("category") || "",
      location: params.get("location") || "",
    });
  }, []);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: artists } = trpc.artists.search.useQuery({
    searchTerm: searchParams.searchTerm || undefined,
    category: searchParams.category || undefined,
    location: searchParams.location || undefined,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.searchTerm) params.set("q", searchParams.searchTerm);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.location) params.set("location", searchParams.location);
    
    setLocation(`/browse?${params.toString()}`);
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
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Discover Artists</h1>
          
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                className="pl-10"
                value={searchParams.searchTerm}
                onChange={(e) => setSearchParams({ ...searchParams, searchTerm: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            
            <Select
              value={searchParams.category}
              onValueChange={(value) => setSearchParams({ ...searchParams, category: value })}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative w-full md:w-[200px]">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          {artists ? `${artists.length} artist${artists.length !== 1 ? "s" : ""} found` : "Loading..."}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists?.map((artist) => {
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
                        <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {artist.location}
                        </p>
                      )}
                      {artist.bio && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{artist.bio}</p>
                      )}
                      {artist.hourlyRate && (
                        <p className="mt-2 font-semibold text-primary">
                          ${(artist.hourlyRate / 100).toFixed(0)}/hr
                        </p>
                      )}
                    </CardContent>
                  </Card>
              </Link>
            );
          })}
        </div>

        {artists?.length === 0 && (
          <div className="py-12 text-center">
            <Palette className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No artists found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
