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
        { orderNo: { contains: search } },
        { customer: { customerName: { contains: search } } },
      ];
    }
    if (status && status !== "All") {
      where.status = status;
    }

    const orders = await prisma.salesOrder.findMany({
      where,
      include: {
        customer: { select: { customerName: true } },
        salesperson: { select: { name: true } },
        currency: { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Sales Order GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, ...orderData } = body;

    // Validation
    if (!orderData.salespersonId) return NextResponse.json({ error: "Salesperson is required" }, { status: 400 });
    if (!orderData.customerId) return NextResponse.json({ error: "Customer is required" }, { status: 400 });
    if (!orderData.paymentTermId) return NextResponse.json({ error: "Payment Term is required" }, { status: 400 });
    if (!orderData.currencyId) return NextResponse.json({ error: "Currency is required" }, { status: 400 });

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i].finishedGoodId) return NextResponse.json({ error: `Item ${i + 1}: Part No / Description is required` }, { status: 400 });
        if (!items[i].uomId) return NextResponse.json({ error: `Item ${i + 1}: UOM is required` }, { status: 400 });
      }
    }

    // Generate Order No
    const currentYear = new Date().getFullYear();
    const count = await prisma.salesOrder.count({
      where: {
        orderNo: { startsWith: `SO-${currentYear}-` },
      },
    });
    const nextNumber = String(count + 1).padStart(4, "0");
    const orderNo = `SO-${currentYear}-${nextNumber}`;

    // Clean up empty string IDs to null where applicable for relations
    const cleanId = (id: any) => (id === "" ? null : id);

    const order = await prisma.salesOrder.create({
      data: {
        ...orderData,
        orderNo,
        revision: 0,
        status: "Draft",
        date: new Date(orderData.date),
        taxTypeId: cleanId(orderData.taxTypeId),
        contactPersonId: cleanId(orderData.contactPersonId),
        deliverToId: cleanId(orderData.deliverToId),
        billToId: cleanId(orderData.billToId),
        customerPoRef: orderData.customerPoRef || null,
        projectCode: orderData.projectCode || null,
        otherPaymentDetail: orderData.otherPaymentDetail || null,
        refContract: orderData.refContract || null,
        fax: orderData.fax || null,
        tel: orderData.tel || null,
        email: orderData.email || null,
        remark: orderData.remark || null,
        uploadUrl: orderData.uploadUrl || null,
        items: {
          create: (items || []).map((item: any) => ({
            ...item,
            deliveryDate: new Date(item.deliveryDate),
            workOrderNo: null, // WO is only generated on confirmation
            remark: item.remark || null,
            uploadUrl: item.uploadUrl || null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Sales Order POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
