"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { timeSlotSchema, type TimeSlotInput } from "@/validations/time-slot.schema";
import { createTimeSlot, updateTimeSlot, deleteTimeSlot } from "@/actions/time-slot.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";
import type { TimeSlot } from "@prisma/client";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Converted from resources/js/Pages/appointment/TimeSlots.jsx + TimeSlotService
export function TimeSlotsManager({ initialSlots }: { initialSlots: TimeSlot[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TimeSlot | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TimeSlotInput>({ resolver: zodResolver(timeSlotSchema) });

  function openCreate() {
    setEditing(null);
    reset({ day: "Monday", startTime: "09:00", endTime: "13:00", status: true, mode: "both" });
    setOpen(true);
  }
  function openEdit(s: TimeSlot) {
    setEditing(s);
    reset({ day: s.day as TimeSlotInput["day"], startTime: s.startTime.slice(0, 5), endTime: s.endTime.slice(0, 5), status: s.status, mode: s.mode });
    setOpen(true);
  }

  async function onSubmit(data: TimeSlotInput) {
    const result = editing ? await updateTimeSlot(editing.id, data) : await createTimeSlot(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    if (editing) {
      setSlots((prev) => prev.map((s) => (s.id === editing.id ? (result.data as TimeSlot) : s)));
    } else {
      setSlots((prev) => [...prev, result.data as TimeSlot]);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this time slot?")) return;
    const result = await deleteTimeSlot(id);
    if (result.success) {
      toast.success(result.message);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Time Slots</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Time Slot" : "Add Time Slot"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-1">
                <Label>Day</Label>
                <select className="w-full h-10 border rounded-md px-3 text-sm" {...register("day")}>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Start time</Label>
                  <Input type="time" {...register("startTime")} />
                </div>
                <div className="space-y-1">
                  <Label>End time</Label>
                  <Input type="time" {...register("endTime")} />
                  {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Mode</Label>
                <select className="w-full h-10 border rounded-md px-3 text-sm" {...register("mode")}>
                  <option value="both">Both</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("status")} defaultChecked />
                Active
              </label>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2" />}
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.day}</TableCell>
              <TableCell>{formatTime(s.startTime)} - {formatTime(s.endTime)}</TableCell>
              <TableCell className="capitalize">{s.mode}</TableCell>
              <TableCell>
                <Badge variant={s.status ? "success" : "outline"}>{s.status ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(s.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {slots.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No time slots configured yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
