import { NextResponse } from "next/server";
import { deleteHeroImage } from "@/actions/hero-image.actions";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await deleteHeroImage(Number(id));
  return NextResponse.json(result);
}
