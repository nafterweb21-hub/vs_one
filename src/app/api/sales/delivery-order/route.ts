import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { doNo: { contains: search } },
        { customer: { customerName: { contains: search } } },
        { salesOrder: { orderNo: { contains: search } } },
      ];
    }
    if (status && status !== "All") {
      where.status = status;
    }

    const deliveryOrders = await prisma.deliveryOrder.findMany({
      where,
      include: {
        customer: { select: { customerName: true } },
        salesOrder: { select: { orderNo: true, customerPoRef: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deliveryOrders);
  } catch (error: any) {
    console.error("Delivery Order GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, ...doData } = body;

    // Validation
    if (!doData.doNo) return NextResponse.json({ error: "DO No is required" }, { status: 400 });
    if (!doData.doDate) return NextResponse.json({ error: "DO Date is required" }, { status: 400 });
    if (!doData.customerId) return NextResponse.json({ error: "Customer is required" }, { status: 400 });
    if (!doData.salesOrderId) return NextResponse.json({ error: "Sales Order is required" }, { status: 400 });

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i].workOrderNo) return NextResponse.json({ error: `Item ${i + 1}: Work Order No is required` }, { status: 400 });
        if (!items[i].quantity || items[i].quantity <= 0) return NextResponse.json({ error: `Item ${i + 1}: Valid Quantity is required` }, { status: 400 });
      }
    }

    // Check unique DO No
    const existing = await prisma.deliveryOrder.findUnique({
      where: { doNo: doData.doNo }
    });
    if (existing) return NextResponse.json({ error: "DO No already exists" }, { status: 400 });

    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        ...doData,
        doDate: new Date(doData.doDate),
        cocRequired: doData.cocRequired || false,
        status: doData.status || "Draft",
        items: {
          create: (items || []).map((item: any) => ({
            workOrderNo: item.workOrderNo,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(deliveryOrder, { status: 201 });
  } catch (error: any) {
    console.error("Delivery Order POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
