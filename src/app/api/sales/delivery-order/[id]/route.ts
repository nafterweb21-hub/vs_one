import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        salesOrder: {
          include: {
            items: true
          }
        },
        items: {
          include: {
            workOrder: true
          }
        }
      },
    });

    if (!deliveryOrder) {
      return NextResponse.json({ error: "Delivery Order not found" }, { status: 404 });
    }

    return NextResponse.json(deliveryOrder);
  } catch (error: any) {
    console.error("Delivery Order GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { items, ...doData } = body;

    // Validation
    if (!doData.doNo) return NextResponse.json({ error: "DO No is required" }, { status: 400 });
    if (!doData.doDate) return NextResponse.json({ error: "DO Date is required" }, { status: 400 });

    const existing = await prisma.deliveryOrder.findUnique({
      where: { doNo: doData.doNo },
    });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "DO No already exists" }, { status: 400 });
    }

    // Delete existing items to recreate them
    await prisma.deliveryOrderItem.deleteMany({
      where: { deliveryOrderId: id },
    });

    const deliveryOrder = await prisma.deliveryOrder.update({
      where: { id },
      data: {
        doNo: doData.doNo,
        doDate: new Date(doData.doDate),
        customerId: doData.customerId,
        salesOrderId: doData.salesOrderId,
        cocRequired: doData.cocRequired || false,
        status: doData.status,
        items: {
          create: (items || []).map((item: any) => ({
            workOrderNo: item.workOrderNo,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(deliveryOrder);
  } catch (error: any) {
    console.error("Delivery Order PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.deliveryOrder.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Delivery Order deleted successfully" });
  } catch (error: any) {
    console.error("Delivery Order DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
