import { NextResponse } from "next/server";
import { updateTreatment, deleteTreatment } from "@/actions/treatment.actions";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const result = await updateTreatment(Number(params.id), formData);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const result = await deleteTreatment(Number(params.id));
  return NextResponse.json(result);
}
