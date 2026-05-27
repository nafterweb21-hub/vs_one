"use server";

import { prisma } from "@/lib/prisma";

export async function getFormData() {
  try {
    const customers = await prisma.customerProfile.findMany({
      where: { status: "Active" },
      select: { id: true, customerName: true, customerPoRef: true }
    });

    const salesOrders = await prisma.salesOrder.findMany({
      where: { status: { not: "Void" } },
      select: { 
        id: true, 
        orderNo: true, 
        customerId: true, 
        customerPoRef: true,
        items: {
          select: {
            batches: {
              select: {
                workOrderNo: true
              }
            }
          }
        }
      }
    });

    const workOrders = await prisma.workOrder.findMany({
      where: { status: { not: "Cancelled" } },
      select: {
        workOrderNo: true,
        quantity: true,
        uom: true,
        deliveryDate: true
      }
    });

    return {
      customers,
      salesOrders,
      workOrders: workOrders.map(wo => ({
        ...wo,
        quantity: wo.quantity ? Number(wo.quantity) : 0,
      }))
    };
  } catch (error) {
    console.error("Error fetching DO form data:", error);
    throw new Error("Failed to load prerequisite data: " + (error as any).message);
  }
}
