"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFailureModes() {
  return await prisma.failureMode.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export type FailureModeData = {
  failureMode: string;
  remark: string | null;
};

export async function createFailureMode(data: FailureModeData) {
  try {
    const existing = await prisma.failureMode.findUnique({
      where: { failureMode: data.failureMode },
    });
    
    if (existing) {
      return { success: false, error: "Failure Mode must be unique." };
    }

    await prisma.failureMode.create({
      data,
    });

    revalidatePath("/dashboard/admin/master-profile/failure-mode");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating failure mode:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create failure mode" };
  }
}

export async function updateFailureMode(id: string, data: Partial<FailureModeData>) {
  try {
    // Exclude `failureMode` from updatable data as it cannot be changed once saved
    const { failureMode, ...updatableData } = data;
    
    await prisma.failureMode.update({
      where: { id },
      data: updatableData,
    });

    revalidatePath("/dashboard/admin/master-profile/failure-mode");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating failure mode:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update failure mode" };
  }
}

export async function deleteFailureMode(id: string) {
  try {
    const failureModeData = await prisma.failureMode.findUnique({ where: { id } });
    if (!failureModeData) return { success: false, error: "Failure Mode not found" };

    await prisma.failureMode.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/master-profile/failure-mode");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting failure mode:", error);
    return { success: false, error: "Failed to delete failure mode" };
  }
}

export async function updateFailureModeStatus(id: string, newStatus: string) {
  try {
    const failureModeData = await prisma.failureMode.findUnique({ where: { id } });
    if (!failureModeData) return { success: false, error: "Failure Mode not found" };

    await prisma.failureMode.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/admin/master-profile/failure-mode");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating failure mode status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
