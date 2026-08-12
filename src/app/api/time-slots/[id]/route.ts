import { NextResponse } from "next/server";
import { getTimeSlotById, updateTimeSlot, deleteTimeSlot } from "@/actions/time-slot.actions";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await getTimeSlotById(Number(params.id)));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const result = await updateTimeSlot(Number(params.id), await req.json());
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const result = await deleteTimeSlot(Number(params.id));
  return NextResponse.json(result);
}
