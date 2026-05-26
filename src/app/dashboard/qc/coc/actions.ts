"use server";

import { revalidatePath } from "next/cache";
import {
  getCocs,
  getCocById,
  createCoc,
  updateCoc,
  checkCoc,
  approveCoc,
  deleteCoc,
} from "@/lib/coc";
import { auth } from "@/lib/auth";

export async function getCocsList() {
  try {
    const data = await getCocs();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching COCs:", error);
    return { success: false, error: `Failed to fetch COCs: ${error.message || String(error)}` };
  }
}

export async function getCocDetail(id: string) {
  try {
    const data = await getCocById(id);
    if (!data) return { success: false, error: "COC not found." };
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching COC detail:", error);
    return { success: false, error: "Failed to fetch COC details." };
  }
}

export async function createNewCoc(data: any) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Ensure combination is unique - Prisma constraint will handle this and throw P2002 if duplicate.
    const newItem = await createCoc(data);
    revalidatePath("/dashboard/qc/coc");
    return { success: true, data: newItem };
  } catch (error: any) {
    console.error("Error creating COC:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "A COC with this combination already exists." };
    }
    return { success: false, error: error.message || "Failed to create COC." };
  }
}

export async function updateExistingCoc(id: string, data: any) {
  try {
    const updated = await updateCoc(id, data);
    revalidatePath("/dashboard/qc/coc");
    revalidatePath(`/dashboard/qc/coc/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating COC:", error);
    return { success: false, error: error.message || "Failed to update COC." };
  }
}

export async function checkCocAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.employeeId) {
      return { success: false, error: "Unauthorized or employee record not found." };
    }

    const updated = await checkCoc(id, session.user.employeeId);
    revalidatePath("/dashboard/qc/coc");
    revalidatePath(`/dashboard/qc/coc/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error checking COC:", error);
    return { success: false, error: error.message || "Failed to check COC." };
  }
}

export async function approveCocAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.employeeId) {
      return { success: false, error: "Unauthorized or employee record not found." };
    }

    const updated = await approveCoc(id, session.user.employeeId);
    revalidatePath("/dashboard/qc/coc");
    revalidatePath(`/dashboard/qc/coc/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error approving COC:", error);
    return { success: false, error: error.message || "Failed to approve COC." };
  }
}

export async function removeCoc(id: string) {
  try {
    await deleteCoc(id);
    revalidatePath("/dashboard/qc/coc");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting COC:", error);
    return { success: false, error: error.message || "Failed to delete COC." };
  }
}
