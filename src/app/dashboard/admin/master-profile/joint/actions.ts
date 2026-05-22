
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getJoints() {
  return await prisma.joint.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export type JointData = {
  joint: string;
  remark: string | null;
};

export async function createJoint(data: JointData) {
  try {
    const existing = await prisma.joint.findUnique({
      where: { joint: data.joint },
    });

    if (existing) {
      return { success: false, error: "Joint must be unique." };
    }

    await prisma.joint.create({
      data,
    });

    revalidatePath("/dashboard/admin/master-profile/joint");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating joint:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create joint" };
  }
}

export async function updateJoint(id: string, data: Partial<JointData>) {
  try {
    // Exclude `joint` from updatable data as it cannot be changed once saved
    const { joint, ...updatableData } = data;

    await prisma.joint.update({
      where: { id },
      data: updatableData,
    });

    revalidatePath("/dashboard/admin/master-profile/joint");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating joint:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update joint" };
  }
}

export async function deleteJoint(id: string) {
  try {
    const jointData = await prisma.joint.findUnique({ where: { id } });
    if (!jointData) return { success: false, error: "Joint not found" };

    await prisma.joint.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/master-profile/joint");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting joint:", error);
    return { success: false, error: "Failed to delete joint" };
  }
}

export async function updateJointStatus(id: string, newStatus: string) {
  try {
    const jointData = await prisma.joint.findUnique({ where: { id } });
    if (!jointData) return { success: false, error: "Joint not found" };

    await prisma.joint.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/admin/master-profile/joint");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating joint status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
