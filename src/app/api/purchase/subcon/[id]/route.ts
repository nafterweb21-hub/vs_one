import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePurchaseOrderSubcon, transitionPurchaseOrderSubcon } from "@/lib/purchaseOrderSubcon";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const po = await prisma.purchaseOrderSubcon.findUnique({
      where: { id },
      include: {
        items: true,
        supplier: true,
        purchaser: true,
        company: true,
        currency: true,
        taxType: true,
      },
    });

    if (!po) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(po);
  } catch (e: any) {
    console.error("POSubcon GET individual:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updatePurchaseOrderSubcon(id, body);
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("POSubcon PUT:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await transitionPurchaseOrderSubcon(id, "void", "");
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("POSubcon DELETE:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
