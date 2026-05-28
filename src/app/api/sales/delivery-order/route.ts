import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const where = search
      ? {
          OR: [
            { doNo: { contains: search, mode: "insensitive" as const } },
            { customer: { customerName: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.deliveryOrder.count({ where }),
      prisma.deliveryOrder.findMany({
        where,
        include: {
          customer: { select: { customerName: true } },
          salesOrder: { select: { orderNo: true, customerPoRef: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ total, data, page, pageSize });
  } catch (error: any) {
    console.error("Delivery Order List Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doNo, date, customerId, salesOrderId, cocRequired, items } = body;

    // Validate if doNo already exists
    const existing = await prisma.deliveryOrder.findUnique({
      where: { doNo },
    });
    if (existing) {
      return NextResponse.json({ error: "Delivery Order No already exists." }, { status: 400 });
    }

    const newDO = await prisma.deliveryOrder.create({
      data: {
        doNo,
        date: new Date(date),
        customerId,
        salesOrderId,
        cocRequired: !!cocRequired,
        status: "Draft",
        items: {
          create: items.map((item: any) => ({
            workOrderNo: item.workOrderNo,
            quantity: Number(item.quantity),
            uomId: item.uomId || null,
            deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, id: newDO.id });
  } catch (error: any) {
    console.error("Create Delivery Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
