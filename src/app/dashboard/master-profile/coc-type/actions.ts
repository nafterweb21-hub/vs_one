"use server";

import { revalidatePath } from "next/cache";
import {
  getCocTypes,
  createCocType,
  updateCocType,
  deleteCocType,
} from "@/lib/coc-types";

export async function getCocTypesList() {
  try {
    const data = await getCocTypes();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching COC types:", error);
    return { success: false, error: "Failed to fetch COC types." };
  }
}

export async function getCocTypeDetail(id: string) {
  try {
    const data = await getCocTypes();
    const item = data.find((d: any) => d.id === id);
    if (!item) return { success: false, error: "COC Type not found." };
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Error fetching COC type detail:", error);
    return { success: false, error: "Failed to fetch COC type details." };
  }
}

export async function createCocTypeProfile(data: { type: string; remark?: string }) {
  try {
    const newItem = await createCocType(data);
    revalidatePath("/dashboard/master-profile/coc-type");
    return { success: true, data: newItem };
  } catch (error: any) {
    console.error("Error creating COC type:", error);
    return { success: false, error: error.message || "Failed to create COC type." };
  }
}

export async function updateCocTypeProfile(id: string, data: { remark?: string; status?: string }) {
  try {
    const updated = await updateCocType(id, data);
    revalidatePath("/dashboard/master-profile/coc-type");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating COC type:", error);
    return { success: false, error: error.message || "Failed to update COC type." };
  }
}

export async function toggleCocTypeStatus(id: string) {
  try {
    const items = await getCocTypes();
    const item = items.find((i: any) => i.id === id);
    if (!item) return { success: false, error: "COC Type not found." };

    const newStatus = item.status === "Active" ? "Inactive" : "Active";
    const updated = await updateCocType(id, {
      status: newStatus,
    });
    revalidatePath("/dashboard/master-profile/coc-type");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error toggling COC type status:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}

export async function deleteCocTypeProfile(id: string) {
  try {
    await deleteCocType(id);
    revalidatePath("/dashboard/master-profile/coc-type");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting COC type:", error);
    return { success: false, error: error.message || "Failed to delete COC type." };
  }
}
