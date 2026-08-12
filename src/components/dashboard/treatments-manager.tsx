"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createTreatment, updateTreatment, deleteTreatment } from "@/actions/treatment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Treatment } from "@prisma/client";

// Converted from resources/js/Pages/cms/Treatment.jsx + TreatmentController + TreatmentServices
export function TreatmentsManager({ initialTreatments }: { initialTreatments: Treatment[] }) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(t: Treatment) {
    setEditing(t);
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const result = editing
      ? await updateTreatment(editing.id, formData)
      : await createTreatment(formData);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    if (editing) {
      setTreatments((prev) => prev.map((t) => (t.id === editing.id ? (result.data as Treatment) : t)));
    } else {
      setTreatments((prev) => [result.data as Treatment, ...prev]);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this treatment?")) return;
    const result = await deleteTreatment(id);
    if (result.success) {
      toast.success(result.message);
      setTreatments((prev) => prev.filter((t) => t.id !== id));
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Treatments (CMS)</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Treatment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Treatment" : "Add Treatment"}</DialogTitle>
            </DialogHeader>
            <form ref={formRef} onSubmit={onSubmit} className="space-y-3" encType="multipart/form-data">
              <div className="space-y-1">
                <Label>Disease</Label>
                <Input name="disease" defaultValue={editing?.disease} maxLength={20} required />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea name="description" defaultValue={editing?.description} required />
              </div>
              <div className="space-y-1">
                <Label>Symptoms</Label>
                <Textarea name="symptoms" defaultValue={editing?.symptoms} required />
              </div>
              <div className="space-y-1">
                <Label>Image {editing && "(leave blank to keep current)"}</Label>
                <Input type="file" name="image" accept="image/png,image/jpeg,image/webp" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Spinner className="mr-2" />}
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {treatments.map((t) => (
          <Card key={t.id}>
            <div className="relative h-40 w-full">
              <Image src={t.image} alt={t.disease} fill className="object-cover rounded-t-xl" />
            </div>
            <CardContent className="pt-4 space-y-2">
              <h3 className="font-semibold">{t.disease}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
              <div className="flex justify-end gap-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(t)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(t.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {treatments.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">No treatments yet.</p>
        )}
      </div>
    </div>
  );
}
