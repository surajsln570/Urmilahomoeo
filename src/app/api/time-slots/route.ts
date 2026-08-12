import { NextResponse } from "next/server";
import { getAllTimeSlots, createTimeSlot } from "@/actions/time-slot.actions";

export async function GET() {
  return NextResponse.json(await getAllTimeSlots());
}

export async function POST(req: Request) {
  const result = await createTimeSlot(await req.json());
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
