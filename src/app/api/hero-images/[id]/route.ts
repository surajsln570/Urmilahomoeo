import { NextResponse } from "next/server";
import { deleteHeroImage } from "@/actions/hero-image.actions";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const result = await deleteHeroImage(Number(params.id));
  return NextResponse.json(result);
}
