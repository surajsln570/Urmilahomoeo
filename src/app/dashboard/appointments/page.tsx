import { getAllAppointments } from "@/actions/appointment.actions";
import { AppointmentsManager } from "@/components/dashboard/appointments-manager";

// Converted from AppointmentController::showAppointment()
export default async function AppointmentsPage() {
  const appointments = await getAllAppointments();
  return <AppointmentsManager initialAppointments={appointments} />;
}
