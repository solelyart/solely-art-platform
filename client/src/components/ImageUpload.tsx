import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (imageData: string, mimeType: string) => Promise<void>;
  currentImage?: string;
  label?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  maxSizeMB?: number;
}

export function ImageUpload({
  onUpload,
  currentImage,
  label = "Upload Image",
  aspectRatio = "square",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      toast.error(`Image must be smaller than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      await onUpload(base64, file.type);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      <Card className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} shadow-elegant hover-lift cursor-pointer`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {preview ? (
          <div className="relative h-full w-full group">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="h-full w-full flex flex-col items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">Click to upload</p>
                <p className="text-xs text-muted-foreground">Max {maxSizeMB}MB</p>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

interface MultiImageUploadProps {
  onUpload: (imageData: string, mimeType: string) => Promise<void>;
  onDelete?: (imageUrl: string) => Promise<void>;
  images: string[];
  maxImages?: number;
  label?: string;
}

export function MultiImageUpload({
  onUpload,
  onDelete,
  images,
  maxImages = 12,
  label = "Portfolio Images",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 5) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      await onUpload(base64, file.type);
      toast.success("Image uploaded successfully");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = async (imageUrl: string) => {
    if (!onDelete) return;

    setDeletingUrl(imageUrl);
    try {
      await onDelete(imageUrl);
      toast.success("Image deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">
          {images.length} / {maxImages}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <Card key={index} className="relative aspect-square overflow-hidden shadow-elegant group">
            <img
              src={imageUrl}
              alt={`Portfolio ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {onDelete && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(imageUrl)}
                  disabled={deletingUrl === imageUrl}
                >
                  {deletingUrl === imageUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        ))}

        {images.length < maxImages && (
          <Card
            className="aspect-square overflow-hidden shadow-elegant hover-lift cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted hover:bg-muted/80 transition-colors">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Add Image</p>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
