"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function fetchWorkOrderFormDependencies() {
  const [customers, employees, uoms] = await Promise.all([
    prisma.customerProfile.findMany({
      where: { status: "Active" },
      select: { id: true, customerName: true, customerCode: true },
      orderBy: { customerName: "asc" },
    }),
    prisma.employee.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.uomProfile.findMany({
      where: { status: "Active" },
      select: { id: true, uomName: true },
      orderBy: { uomName: "asc" },
    }),
  ]);

  return { customers, employees, uoms };
}

export async function createWorkOrder(data: any) {
  try {
    const workOrder = await prisma.workOrder.create({
      data: {
        workOrderNo: data.workOrderNo,
        date: new Date(data.date),
        customerId: data.customerId,
        internalQuotationNo: data.internalQuotationNo || null,
        customerPoRef: data.customerPoRef || null,
        projectCode: data.projectCode || null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        jobDescription: data.jobDescription || null,
        quantity: data.quantity ? Number(data.quantity) : null,
        uom: data.uom || null,
        amount: data.amount ? Number(data.amount) : null,
        remark: data.remark || null,
        status: data.status || "Draft",
        
        qcAcceptance: data.qcAcceptance || null,
        qcById: data.qcById || null,
        qcDate: data.qcDate ? new Date(data.qcDate) : null,
        
        labelQty: data.labelQty ? Number(data.labelQty) : null,
        labelUomId: data.labelUomId || null,
      },
    });

    revalidatePath("/dashboard/production/work-order");
    return { success: true, workOrderNo: workOrder.workOrderNo };
  } catch (error: any) {
    console.error("Failed to create work order:", error);
    return { success: false, error: error.message || "Failed to create work order" };
  }
}

export async function updateWorkOrder(id: string, data: any) {
  try {
    const workOrder = await prisma.workOrder.update({
      where: { workOrderNo: id },
      data: {
        date: new Date(data.date),
        customerId: data.customerId,
        internalQuotationNo: data.internalQuotationNo || null,
        customerPoRef: data.customerPoRef || null,
        projectCode: data.projectCode || null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        jobDescription: data.jobDescription || null,
        quantity: data.quantity ? Number(data.quantity) : null,
        uom: data.uom || null,
        amount: data.amount ? Number(data.amount) : null,
        remark: data.remark || null,
        status: data.status,
        
        qcAcceptance: data.qcAcceptance || null,
        qcById: data.qcById || null,
        qcDate: data.qcDate ? new Date(data.qcDate) : null,
        
        labelQty: data.labelQty ? Number(data.labelQty) : null,
        labelUomId: data.labelUomId || null,
      },
    });

    revalidatePath(`/dashboard/production/work-order/${id}`);
    revalidatePath("/dashboard/production/work-order");
    return { success: true, workOrderNo: workOrder.workOrderNo };
  } catch (error: any) {
    console.error("Failed to update work order:", error);
    return { success: false, error: error.message || "Failed to update work order" };
  }
}
