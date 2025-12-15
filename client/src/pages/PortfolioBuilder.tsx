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
import { Plus, GripVertical, Trash2, Upload, Star, Pencil } from "lucide-react";
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

function SortableCollection({ collection, onDelete, onEdit, onClick, isSelected }: {
  collection: Collection;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
  isSelected?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: collection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-card border rounded-lg p-4 ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
    >
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
            <Pencil className="w-4 h-4" />
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
            <Pencil className="w-3 h-3" />
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
  
  // Edit collection state
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editCollectionTitle, setEditCollectionTitle] = useState("");
  const [editCollectionDesc, setEditCollectionDesc] = useState("");
  const [isEditCollectionDialogOpen, setIsEditCollectionDialogOpen] = useState(false);
  
  // Edit item state
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDesc, setEditItemDesc] = useState("");
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);

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

  const updateCollectionMutation = trpc.portfolio.updateCollection.useMutation({
    onSuccess: () => {
      utils.portfolio.getMyCollections.invalidate();
      setIsEditCollectionDialogOpen(false);
      setEditingCollection(null);
    },
  });

  const deleteCollectionMutation = trpc.portfolio.deleteCollection.useMutation({
    onSuccess: () => {
      utils.portfolio.getMyCollections.invalidate();
      setSelectedCollection(null);
    },
  });

  const updateItemMutation = trpc.portfolio.updateItem.useMutation({
    onSuccess: () => {
      utils.portfolio.getItems.invalidate({ collectionId: selectedCollection! });
      setIsEditItemDialogOpen(false);
      setEditingItem(null);
    },
  });

  const deleteItemMutation = trpc.portfolio.deleteItem.useMutation({
    onSuccess: () => {
      utils.portfolio.getItems.invalidate({ collectionId: selectedCollection! });
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

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setEditCollectionTitle(collection.title);
    setEditCollectionDesc(collection.description || "");
    setIsEditCollectionDialogOpen(true);
  };

  const handleSaveCollection = () => {
    if (editingCollection && editCollectionTitle.trim()) {
      updateCollectionMutation.mutate({
        id: editingCollection.id,
        title: editCollectionTitle,
        description: editCollectionDesc || undefined,
      });
    }
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setEditItemTitle(item.title);
    setEditItemDesc(item.description || "");
    setIsEditItemDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (editingItem && editItemTitle.trim()) {
      updateItemMutation.mutate({
        id: editingItem.id,
        title: editItemTitle,
        description: editItemDesc || undefined,
      });
    }
  };

  const handleDeleteItem = (item: PortfolioItem) => {
    if (confirm(`Delete "${item.title}"?`)) {
      deleteItemMutation.mutate({ id: item.id });
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
                <Button size="sm" data-testid="new-collection-button">
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
                      data-testid="collection-title-input"
                      value={newCollectionTitle}
                      onChange={(e) => setNewCollectionTitle(e.target.value)}
                      placeholder="e.g., Portrait Photography"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      data-testid="collection-description-input"
                      value={newCollectionDesc}
                      onChange={(e) => setNewCollectionDesc(e.target.value)}
                      placeholder="Describe this collection..."
                    />
                  </div>
                  <Button
                    data-testid="create-collection-button"
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
                    isSelected={collection.id === selectedCollection}
                    onClick={() => setSelectedCollection(collection.id)}
                    onEdit={() => handleEditCollection(collection)}
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
                <Button size="sm" data-testid="add-image-button">
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
                        onEdit={() => handleEditItem(item)}
                        onDelete={() => handleDeleteItem(item)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {items.length === 0 && (
                <Card className="p-12 text-center text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No images in this collection yet.</p>
                  <p className="text-sm">Click "Add Image" to upload your work.</p>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              <p>Select a collection to view and manage its items</p>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditCollectionDialogOpen} onOpenChange={setIsEditCollectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editCollectionTitle}
                onChange={(e) => setEditCollectionTitle(e.target.value)}
                placeholder="Collection title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editCollectionDesc}
                onChange={(e) => setEditCollectionDesc(e.target.value)}
                placeholder="Describe this collection..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditCollectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveCollection}
                disabled={!editCollectionTitle.trim() || updateCollectionMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {editingItem && (
              <div className="flex justify-center">
                <img 
                  src={editingItem.imageUrl} 
                  alt={editingItem.title} 
                  className="w-40 h-40 object-cover rounded"
                />
              </div>
            )}
            <div>
              <Label htmlFor="edit-item-title">Title</Label>
              <Input
                id="edit-item-title"
                value={editItemTitle}
                onChange={(e) => setEditItemTitle(e.target.value)}
                placeholder="Item title"
              />
            </div>
            <div>
              <Label htmlFor="edit-item-description">Description</Label>
              <Textarea
                id="edit-item-description"
                value={editItemDesc}
                onChange={(e) => setEditItemDesc(e.target.value)}
                placeholder="Describe this piece..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveItem}
                disabled={!editItemTitle.trim() || updateItemMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
