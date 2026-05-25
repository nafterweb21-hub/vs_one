import { NextResponse } from "next/server";
import { transitionPurchaseOrderSubcon } from "@/lib/purchaseOrderSubcon";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, userId } = body;
    
    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    let userToRecord = userId;
    if (!userToRecord) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return NextResponse.json({ error: "No user found in database to perform approval. Please create a user first." }, { status: 400 });
      }
      userToRecord = firstUser.id;
    }

    const result = await transitionPurchaseOrderSubcon(id, action, userToRecord);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("POSubcon transition POST:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
