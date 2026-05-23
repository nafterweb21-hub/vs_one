import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.salesOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: { batches: true },
        },
      },
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { items, status, ...orderData } = body;

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

    // Get current order to check status change
    const currentOrder = await prisma.salesOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let nextRevision = currentOrder.revision;
    // If status changes to Confirmed, increment revision
    if (status === "Confirmed" && currentOrder.status !== "Confirmed") {
      nextRevision += 1;
    }

    const cleanId = (id: any) => (id === "" ? null : id);

    // Delete existing items and recreate to simplify updates
    await prisma.salesOrderItem.deleteMany({
      where: { salesOrderId: id },
    });

    // Spec WO No format: 8XXXXX-A-B (numeric).
    // 8XXXXX = "8" + last 4 digits of SO orderNo (e.g. SO-2026-0003 -> 800003).
    // A = sequential part index in SO (1-based). B = batch index of that part (1-based).
    const trailingDigits = (currentOrder.orderNo.match(/(\d+)\s*$/)?.[1] ?? "0").padStart(4, "0");
    const woBase = `8${trailingDigits.slice(-4)}`;

    const itemsData = (items || []).map((item: any, index: number) => {
      return {
        partId: item.partId,
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        uomId: item.uomId,
        internalQuotationNo: item.internalQuotationNo || "N/A",
        vendorMaterialNo: item.vendorMaterialNo || null,
        materialSpecification: item.materialSpecification || null,
        estimateNo: item.estimateNo || null,
        remark: item.remark || null,
        uploadUrl: item.uploadUrl || null,
        batches: {
          create: (item.batches || [{
            quantity: item.quantity,
            deliveryDate: item.deliveryDate || new Date(),
            noRoutingProcess: item.noRoutingProcess || false,
            remark: null,
            uploadUrl: null,
            workOrderNo: item.workOrderNo || null,
          }]).map((b: any, bIndex: number) => {
            let woNo = b.workOrderNo;
            if (status === "Confirmed" && !woNo) {
              woNo = `${woBase}-${index + 1}-${bIndex + 1}`;
            }

            return {
              quantity: Number(b.quantity) || 0,
              deliveryDate: new Date(b.deliveryDate),
              noRoutingProcess: b.noRoutingProcess || false,
              workOrderNo: woNo || null,
              remark: b.remark || null,
              uploadUrl: b.uploadUrl || null,
            };
          })
        }
      };
    });

    const updatedOrder = await prisma.salesOrder.update({
      where: { id },
      data: {
        ...orderData,
        date: new Date(orderData.date),
        status,
        revision: nextRevision,
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
          create: itemsData,
        },
      },
      include: { items: true },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Sales Order PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
