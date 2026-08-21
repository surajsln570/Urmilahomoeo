"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { updateAppointmentStatus, deleteAppointment } from "@/actions/appointment.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/utils";
import type { Appointment, TimeSlot } from "@prisma/client";

type AppointmentWithSlot = Appointment & { timeSlot: TimeSlot };

const statusVariant: Record<string, "success" | "secondary" | "destructive" | "outline-solid"> = {
  pending: "secondary",
  confirmed: "outline-solid",
  completed: "success",
  cancelled: "destructive",
};

// Converted from resources/js/Pages/appointment/index.jsx + AppointmentCard.jsx
export function AppointmentsManager({ initialAppointments }: { initialAppointments: AppointmentWithSlot[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);

  async function onStatusChange(id: number, status: string) {
    const result = await updateAppointmentStatus(id, status);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as Appointment["status"] } : a)));
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this appointment?")) return;
    const result = await deleteAppointment(id);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Appointments</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.patientName}</TableCell>
              <TableCell>{a.patientMobile}</TableCell>
              <TableCell>{formatDate(a.date)}</TableCell>
              <TableCell>
                {formatTime(a.timeSlot.startTime)} - {formatTime(a.timeSlot.endTime)}
              </TableCell>
              <TableCell className="capitalize">{a.mode}</TableCell>
              <TableCell>
                <select
                  className="border rounded-md text-sm px-2 py-1"
                  value={a.status}
                  onChange={(e) => onStatusChange(a.id, e.target.value)}
                >
                  {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Badge variant={statusVariant[a.status]} className="ml-2 capitalize">{a.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost" onClick={() => onDelete(a.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {appointments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No appointments yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
