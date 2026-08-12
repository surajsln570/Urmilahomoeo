import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUser, deleteUser } from "@/actions/user.actions";

// Converted from app/modules/user/routes/web.php (PUT/DELETE /users/{id})
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = await updateUser(Number(id), body);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await deleteUser(Number(params.id));
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
