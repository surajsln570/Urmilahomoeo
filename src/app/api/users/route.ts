import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers, createUser } from "@/actions/user.actions";

// Converted from app/modules/user/routes/web.php (GET /users, POST /create-user)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = await createUser(body);
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
