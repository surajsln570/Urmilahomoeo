import { NextResponse } from "next/server";
import { getTimeSlotById, updateTimeSlot, deleteTimeSlot } from "@/actions/time-slot.actions";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  return NextResponse.json(await getTimeSlotById(Number(id)));
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await updateTimeSlot(Number(id), await req.json());
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await deleteTimeSlot(Number(id));
  return NextResponse.json(result);
}
