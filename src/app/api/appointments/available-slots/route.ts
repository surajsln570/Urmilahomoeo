import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/actions/appointment.actions";

// GET /api/appointments/available-slots?date=YYYY-MM-DD
// Converted from AppointmentController::availableSlots() (routes/web.php: GET /appointment/slots)
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date query param is required" }, { status: 422 });
  }
  const slots = await getAvailableSlots(date);
  return NextResponse.json(slots);
}
