"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, UploadCloud } from "lucide-react";
import { uploadHeroImage, deleteHeroImage, toggleHeroImageStatus } from "@/actions/hero-image.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { HeroImage } from "@prisma/client";

// Converted from resources/js/Pages/cms/HeroImage.jsx + HeroController + HeroService
export function HeroImagesManager({ initialImages }: { initialImages: HeroImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const result = await uploadHeroImage(formData);
    setUploading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setImages((prev) => [result.data as HeroImage, ...prev]);
    e.currentTarget.reset();
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this hero image?")) return;
    const result = await deleteHeroImage(id);
    if (result.success) {
      toast.success(result.message);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } else {
      toast.error(result.message);
    }
  }

  async function onToggleStatus(id: number) {
    await toggleHeroImageStatus(id);
    setImages((prev) => prev.map((img) => ({ ...img, status: img.id === id ? !img.status : false })));
    toast.success("Hero image status updated");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hero Images (CMS)</h1>

      <form onSubmit={onUpload} className="flex items-end gap-3" encType="multipart/form-data">
        <div className="space-y-1 flex-1 max-w-sm">
          <Label>Upload new hero image</Label>
          <Input type="file" name="heroImage" accept="image/png,image/jpeg,image/webp" required />
        </div>
        <Button type="submit" disabled={uploading}>
          {uploading ? <Spinner className="mr-2" /> : <UploadCloud className="mr-2 h-4 w-4" />}
          Upload
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <Card key={img.id}>
            <div className="relative h-40 w-full">
              <Image src={img.heroImage} alt="Hero" fill className="object-cover rounded-t-xl" />
              {img.status && (
                <Badge variant="success" className="absolute top-2 left-2">
                  Active on homepage
                </Badge>
              )}
            </div>
            <CardContent className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={img.status} onCheckedChange={() => onToggleStatus(img.id)} />
                <span className="text-sm text-muted-foreground">{img.status ? "Active" : "Inactive"}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onDelete(img.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {images.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">No hero images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
