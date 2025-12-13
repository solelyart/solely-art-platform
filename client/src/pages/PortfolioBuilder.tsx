import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, GripVertical, Trash2, Upload, Star } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

type Collection = {
  id: number;
  title: string;
  description: string | null;
  displayOrder: number;
  isFeatured: boolean;
};

type PortfolioItem = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  displayOrder: number;
  isFeatured: boolean;
};

function SortableCollection({ collection, onDelete, onEdit, onClick }: {
  collection: Collection;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: collection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <button {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="flex-1 cursor-pointer" onClick={onClick}>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{collection.title}</h3>
            {collection.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          </div>
          {collection.description && (
            <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortableItem({ item, onDelete, onEdit }: {
  item: PortfolioItem;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-start gap-3">
        <button {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded" />
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{item.title}</h4>
            {item.isFeatured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioBuilder() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: collections = [], isLoading } = trpc.portfolio.getMyCollections.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: items = [] } = trpc.portfolio.getItems.useQuery(
    { collectionId: selectedCollection! },
    { enabled: !!selectedCollection }
  );

  const createCollectionMutation = trpc.portfolio.createCollection.useMutation({
    onSuccess: () => {
      utils.portfolio.getMyCollections.invalidate();
      setNewCollectionTitle("");
      setNewCollectionDesc("");
      setIsCreateDialogOpen(false);
    },
  });

  const deleteCollectionMutation = trpc.portfolio.deleteCollection.useMutation({
    onSuccess: () => {
      utils.portfolio.getMyCollections.invalidate();
      setSelectedCollection(null);
    },
  });

  const reorderCollectionsMutation = trpc.portfolio.reorderCollections.useMutation();
  const reorderItemsMutation = trpc.portfolio.reorderItems.useMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCollectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = collections.findIndex((c) => c.id === active.id);
      const newIndex = collections.findIndex((c) => c.id === over.id);

      const reordered = arrayMove(collections, oldIndex, newIndex);
      const updates = reordered.map((c, index) => ({ id: c.id, displayOrder: index }));
      
      reorderCollectionsMutation.mutate({ updates });
    }
  };

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(items, oldIndex, newIndex);
      const updates = reordered.map((item, index) => ({ id: item.id, displayOrder: index }));
      
      reorderItemsMutation.mutate({ updates });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Portfolio Builder</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to manage your portfolio
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Log In</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  const selectedCollectionData = collections.find((c) => c.id === selectedCollection);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio Builder</h1>
        <p className="text-muted-foreground">
          Organize your work into collections and showcase your best pieces
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections List */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Collections</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newCollectionTitle}
                      onChange={(e) => setNewCollectionTitle(e.target.value)}
                      placeholder="e.g., Portrait Photography"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCollectionDesc}
                      onChange={(e) => setNewCollectionDesc(e.target.value)}
                      placeholder="Describe this collection..."
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newCollectionTitle.trim()) {
                        createCollectionMutation.mutate({
                          title: newCollectionTitle,
                          description: newCollectionDesc || undefined,
                        });
                      }
                    }}
                    disabled={!newCollectionTitle.trim() || createCollectionMutation.isPending}
                  >
                    Create Collection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCollectionDragEnd}>
            <SortableContext items={collections.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {collections.map((collection) => (
                  <SortableCollection
                    key={collection.id}
                    collection={collection}
                    onClick={() => setSelectedCollection(collection.id)}
                    onEdit={() => {
                      // TODO: Implement edit dialog
                    }}
                    onDelete={() => {
                      if (confirm(`Delete "${collection.title}"?`)) {
                        deleteCollectionMutation.mutate({ id: collection.id });
                      }
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {collections.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No collections yet. Create one to get started!</p>
            </Card>
          )}
        </div>

        {/* Collection Items */}
        <div className="lg:col-span-2">
          {selectedCollectionData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{selectedCollectionData.title}</h2>
                  {selectedCollectionData.description && (
                    <p className="text-sm text-muted-foreground">{selectedCollectionData.description}</p>
                  )}
                </div>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-1" />
                  Add Image
                </Button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
                <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onEdit={() => {
                          // TODO: Implement edit dialog
                        }}
                        onDelete={() => {
                          if (confirm(`Delete "${item.title}"?`)) {
                            // TODO: Implement delete
                          }
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {items.length === 0 && (
                <Card className="p-12 text-center text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No images in this collection yet.</p>
                  <p className="text-sm mt-1">Click "Add Image" to upload your work</p>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              <p>Select a collection to view and manage its images</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
