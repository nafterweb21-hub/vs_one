"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGoodsReceiveFormData() {
  try {
    const [companies, suppliers, purchaseOrders, employees, currencies, taxes] = await Promise.all([
      prisma.companyProfile.findMany({ where: { status: "Active" } }),
      prisma.supplierProfile.findMany({ where: { status: "Active" } }),
      prisma.purchaseOrder.findMany({
        where: { status: "Issued" },
        include: { items: true },
      }),
      prisma.employee.findMany({ where: { status: "ACTIVE" } }),
      prisma.currency.findMany({ where: { status: "Active" } }),
      prisma.taxProfile.findMany({ where: { status: "Active" } }),
    ]);

    const data = { companies, suppliers, purchaseOrders, employees, currencies, taxes };
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching GR form data:", error);
    throw new Error("Failed to load GR form data");
  }
}

export async function createGoodsReceive(data: any) {
  try {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const prefix = `GR${yy}`;

    const latestGR = await prisma.goodsReceive.findFirst({
      where: { grNo: { startsWith: prefix } },
      orderBy: { grNo: "desc" },
    });

    let nextNum = 1;
    if (latestGR) {
      const currentNumStr = latestGR.grNo.replace(prefix, "");
      const currentNum = parseInt(currentNumStr, 10);
      if (!isNaN(currentNum)) {
        nextNum = currentNum + 1;
      }
    }

    const runningDigits = nextNum.toString().padStart(5, "0");
    const grNo = `${prefix}${runningDigits}`;

    const { items, ...grData } = data;

    const newGr = await prisma.goodsReceive.create({
      data: {
        ...grData,
        grNo,
        status: "Draft",
        items: {
          create: items.map((item: any) => ({
            purchaseOrderItemId: item.purchaseOrderItemId,
            receiveQty: item.receiveQty,
          })),
        },
      },
    });

    revalidatePath("/dashboard/purchasing/goods-receive");
    return { success: true, id: newGr.id };
  } catch (error: any) {
    console.error("Error creating GR:", error);
    return { success: false, error: error.message };
  }
}

export async function updateGoodsReceive(id: string, data: any) {
  try {
    const { items, ...grData } = data;

    await prisma.$transaction(async (tx) => {
      await tx.goodsReceive.update({
        where: { id },
        data: grData,
      });

      if (items && items.length > 0) {
        for (const item of items) {
          if (item.id) {
            await tx.goodsReceiveItem.update({
              where: { id: item.id },
              data: { receiveQty: item.receiveQty },
            });
          }
        }
      }
    });

    revalidatePath("/dashboard/purchasing/goods-receive");
    revalidatePath(`/dashboard/purchasing/goods-receive/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating GR:", error);
    return { success: false, error: error.message };
  }
}

export async function submitGoodsReceive(id: string) {
  try {
    // In a real scenario, you'd check PO balances here and update PO status.
    await prisma.goodsReceive.update({
      where: { id },
      data: { status: "Submitted" },
    });

    revalidatePath("/dashboard/purchasing/goods-receive");
    revalidatePath(`/dashboard/purchasing/goods-receive/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting GR:", error);
    return { success: false, error: error.message };
  }
}

export async function voidGoodsReceive(id: string) {
  try {
    await prisma.goodsReceive.update({
      where: { id },
      data: { status: "Void" },
    });

    revalidatePath("/dashboard/purchasing/goods-receive");
    revalidatePath(`/dashboard/purchasing/goods-receive/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error voiding GR:", error);
    return { success: false, error: error.message };
  }
}
