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
    const { items, status, action, ...orderData } = body;

    // Validation
    if (!orderData.salespersonId) return NextResponse.json({ error: "Salesperson is required" }, { status: 400 });
    if (!orderData.customerId) return NextResponse.json({ error: "Customer is required" }, { status: 400 });
    if (!orderData.paymentTermId) return NextResponse.json({ error: "Payment Term is required" }, { status: 400 });
    if (!orderData.currencyId) return NextResponse.json({ error: "Currency is required" }, { status: 400 });

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i].partId) return NextResponse.json({ error: `Item ${i + 1}: Part No / Description is required` }, { status: 400 });
        if (!items[i].uomId) return NextResponse.json({ error: `Item ${i + 1}: UOM is required` }, { status: 400 });
      }
    }

    const currentOrder = await prisma.salesOrder.findUnique({
      where: { id },
      include: { items: { include: { batches: true, part: true, uom: true } } },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const cleanId = (id: any) => (id === "" ? null : id);
    const baseOrderNo = currentOrder.orderNo.split("-")[0];

    // --- REVISE ACTION ---
    if (action === "Revise") {
      const nextRevision = currentOrder.revision + 1;
      const newOrderNo = `${baseOrderNo}-R${nextRevision}`;

      // Set current to Old Version
      await prisma.salesOrder.update({
        where: { id },
        data: { status: "Old Version" },
      });

      // Create new cloned order
      const clonedOrder = await prisma.salesOrder.create({
        data: {
          ...orderData,
          orderNo: newOrderNo,
          revision: nextRevision,
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
                create: (item.batches || []).map((b: any) => ({
                  quantity: Number(b.quantity) || 0,
                  deliveryDate: new Date(b.deliveryDate),
                  noRoutingProcess: b.noRoutingProcess || false,
                  workOrderNo: null, // Reset for revision
                  remark: b.remark || null,
                  uploadUrl: b.uploadUrl || null,
                }))
              }
            })),
          },
        },
        include: { items: true },
      });

      return NextResponse.json(clonedOrder);
    }

    // --- NORMAL UPDATE OR CONFIRM ---
    // If not revising, we just update the current order.

    // Delete existing items and recreate to simplify updates
    await prisma.salesOrderItem.deleteMany({
      where: { salesOrderId: id },
    });

    const isConfirming = status === "Confirmed" && currentOrder.status !== "Confirmed";

    const workOrdersToCreate: any[] = [];

    const itemsData = (items || []).map((item: any, index: number) => {
      const itemSeq = index + 1;

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
            const batchSeq = bIndex + 1;
            let woNo = b.workOrderNo;

            if (isConfirming && !woNo) {
              // Format: 8XXXXX-A-B
              woNo = `${baseOrderNo}-${itemSeq}-${batchSeq}`;
              
              // Push to array to create actual WorkOrder records later
              workOrdersToCreate.push({
                workOrderNo: woNo,
                date: new Date(),
                customerId: orderData.customerId,
                internalQuotationNo: item.internalQuotationNo || null,
                customerPoRef: orderData.customerPoRef || null,
                projectCode: orderData.projectCode || null,
                deliveryDate: new Date(b.deliveryDate),
                jobDescription: item.description || "N/A",
                quantity: Number(b.quantity) || 0,
                uom: item.uomName || null,
                status: "Draft",
                remark: b.remark || null,
              });
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

    // Create Work Orders if there are any
    if (workOrdersToCreate.length > 0) {
      await prisma.workOrder.createMany({
        data: workOrdersToCreate,
        skipDuplicates: true, // In case it already exists
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Sales Order PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
