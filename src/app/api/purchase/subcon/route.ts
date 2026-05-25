import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPurchaseOrderSubcon } from "@/lib/purchaseOrderSubcon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { poNo: { contains: search, mode: "insensitive" } },
        { workOrderNo: { contains: search, mode: "insensitive" } },
        { supplier: { supplierName: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status && status !== "All") {
      where.status = status;
    } else {
      where.status = { not: "Old Version" };
    }

    const rows = await prisma.purchaseOrderSubcon.findMany({
      where,
      include: {
        supplier: { select: { supplierName: true } },
        purchaser: { select: { name: true } },
        currency: { select: { code: true } },
        taxType: { select: { taxType: true, taxRate: true } },
      },
      orderBy: [{ poNo: "desc" }, { revision: "desc" }],
    });
    return NextResponse.json(rows);
  } catch (e: any) {
    console.error("POSubcon GET:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const po = await createPurchaseOrderSubcon(body);
    return NextResponse.json(po, { status: 201 });
  } catch (e: any) {
    console.error("POSubcon POST:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
