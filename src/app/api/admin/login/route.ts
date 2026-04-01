import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const ok = await loginAdmin(username as string, password as string);
  if (ok) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
