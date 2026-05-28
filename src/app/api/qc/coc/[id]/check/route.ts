import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { userId } = body; // Assume the frontend passes the currently logged-in user's ID

    if (!userId) {
       return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const current = await prisma.certificateOfConformity.findUnique({
      where: { id },
      include: { deliveryOrder: true },
    });
    
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (current.status !== "Draft") {
      return NextResponse.json({ error: "Only draft COCs can be checked." }, { status: 400 });
    }

    if (current.deliveryOrder.status === "Submitted") {
      return NextResponse.json({ error: "Cannot check COC because the associated Delivery Order has already been submitted." }, { status: 400 });
    }

    await prisma.certificateOfConformity.update({
      where: { id },
      data: {
        checkedById: userId,
        checkedDate: new Date(),
        status: "Require Approval", // Move to next state
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Check COC Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
