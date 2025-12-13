import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { NoPortfolioYet } from "./EmptyState";

export function PortfolioDisplay({ artistId }: { artistId: number }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  const { data: collections = [] } = trpc.portfolio.getCollections.useQuery({ artistId });
  const { data: allItemsData = [] } = trpc.portfolio.getArtistItems.useQuery({ artistId });
  const { data: featuredItemsData = [] } = trpc.portfolio.getFeaturedItems.useQuery({ artistId, limit: 6 });

  // Extract items from the joined result
  const allItems = allItemsData.map((row) => row.item);
  const featuredItems = featuredItemsData.map((row) => row.item);

  const displayItems = selectedCollection
    ? allItems.filter((item) => item.collectionId === selectedCollection)
    : featuredItems;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    const newIndex = direction === 'prev'
      ? (selectedImageIndex - 1 + displayItems.length) % displayItems.length
      : (selectedImageIndex + 1) % displayItems.length;
    
    setSelectedImageIndex(newIndex);
  };

  if (collections.length === 0 && allItems.length === 0) {
    return (
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <NoPortfolioYet />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-2xl">Portfolio</CardTitle>
        {collections.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCollection === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCollection(null)}
            >
              Featured
            </Button>
            {collections.map((collection) => (
              <Button
                key={collection.id}
                variant={selectedCollection === collection.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCollection(collection.id)}
              >
                {collection.title}
                {collection.isFeatured && <Star className="w-3 h-3 ml-1 fill-current" />}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {displayItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {displayItems.map((item, index) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div 
                    className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer hover-lift shadow-elegant"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-medium text-sm">{item.title}</h4>
                        {item.description && (
                          <p className="text-white/80 text-xs mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                    {item.isFeatured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                      </Badge>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0">
                  <div className="relative">
                    <img
                      src={displayItems[selectedImageIndex ?? index].imageUrl}
                      alt={displayItems[selectedImageIndex ?? index].title}
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h3 className="text-white font-semibold text-lg">
                        {displayItems[selectedImageIndex ?? index].title}
                      </h3>
                      {displayItems[selectedImageIndex ?? index].description && (
                        <p className="text-white/90 text-sm mt-2">
                          {displayItems[selectedImageIndex ?? index].description}
                        </p>
                      )}
                    </div>
                    {displayItems.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={() => navigateImage('prev')}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={() => navigateImage('next')}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No items in this collection yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
