import { NextResponse } from "next/server";
import { updateTreatment, deleteTreatment } from "@/actions/treatment.actions";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const formData = await req.formData();
  const result = await updateTreatment(Number(id), formData);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await deleteTreatment(Number(id));
  return NextResponse.json(result);
}
