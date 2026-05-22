"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPaymentTerms() {
  return await prisma.paymentTerm.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export type PaymentTermData = {
  term: string;
  day: number;
  remark: string | null;
};

export async function createPaymentTerm(data: PaymentTermData) {
  try {
    const existing = await prisma.paymentTerm.findUnique({
      where: { term: data.term },
    });
    
    if (existing) {
      return { success: false, error: "Payment Term must be unique." };
    }

    await prisma.paymentTerm.create({
      data,
    });

    revalidatePath("/dashboard/admin/master-profile/payment-term");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating payment term:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create payment term" };
  }
}

export async function updatePaymentTerm(id: string, data: Partial<PaymentTermData>) {
  try {
    // Exclude `term` from updatable data as it cannot be changed once saved
    const { term, ...updatableData } = data;
    
    await prisma.paymentTerm.update({
      where: { id },
      data: updatableData,
    });

    revalidatePath("/dashboard/admin/master-profile/payment-term");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating payment term:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update payment term" };
  }
}

export async function deletePaymentTerm(id: string) {
  try {
    const paymentTerm = await prisma.paymentTerm.findUnique({ where: { id } });
    if (!paymentTerm) return { success: false, error: "Payment term not found" };

    await prisma.paymentTerm.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/master-profile/payment-term");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting payment term:", error);
    return { success: false, error: "Failed to delete payment term" };
  }
}

export async function updatePaymentTermStatus(id: string, newStatus: string) {
  try {
    const paymentTerm = await prisma.paymentTerm.findUnique({ where: { id } });
    if (!paymentTerm) return { success: false, error: "Payment term not found" };

    await prisma.paymentTerm.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/admin/master-profile/payment-term");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating payment term status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
