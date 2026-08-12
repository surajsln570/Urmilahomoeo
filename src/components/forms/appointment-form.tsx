"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { appointmentSchema, type AppointmentInput } from "@/validations/appointment.schema";
import { bookAppointment } from "@/actions/appointment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Slot = { id: number; label: string };

// Converted from resources/js/components/appointment/AppointmentForm.jsx
// + AppointmentController::store() / availableSlots()
export function AppointmentForm() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { mode: "offline" },
  });

  const date = watch("date");

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/appointments/available-slots?date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  async function onSubmit(data: AppointmentInput) {
    setSubmitting(true);
    const result = await bookAppointment(data);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Appointment booked successfully!");
    reset();
    setSlots([]);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientName">Full name</Label>
        <Input id="patientName" {...register("patientName")} />
        {errors.patientName && <p className="text-sm text-destructive">{errors.patientName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="patientMobile">Mobile number</Label>
        <Input id="patientMobile" placeholder="10-digit mobile number" {...register("patientMobile")} />
        {errors.patientMobile && <p className="text-sm text-destructive">{errors.patientMobile.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Preferred date</Label>
        <Input id="date" type="date" min={today} {...register("date")} />
        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Available time slot</Label>
        <Controller
          control={control}
          name="timeSlotId"
          render={({ field }) => (
            <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : undefined}>
              <SelectTrigger>
                <SelectValue placeholder={loadingSlots ? "Loading slots..." : "Select a time slot"} />
              </SelectTrigger>
              <SelectContent>
                {slots.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {date ? "No slots available for this date" : "Choose a date first"}
                  </div>
                )}
                {slots.map((slot) => (
                  <SelectItem key={slot.id} value={String(slot.id)}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.timeSlotId && <p className="text-sm text-destructive">{errors.timeSlotId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Consultation mode</Label>
        <Controller
          control={control}
          name="mode"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offline">In-clinic</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting && <Spinner className="mr-2" />}
        Book appointment
      </Button>
    </form>
  );
}
