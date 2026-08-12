import { getAllTimeSlots } from "@/actions/time-slot.actions";
import { TimeSlotsManager } from "@/components/dashboard/time-slots-manager";

// Converted from AppointmentController::timeSlots()
export default async function TimeSlotsPage() {
  const slots = await getAllTimeSlots();
  return <TimeSlotsManager initialSlots={slots} />;
}
