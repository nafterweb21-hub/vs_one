import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types/role";

export async function requireRole(...roles: UserRole[]) {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!roles.includes(session.user.role)) {
    return {
      session,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}
