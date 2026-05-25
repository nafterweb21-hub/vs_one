"use server";

import { revalidatePath } from "next/cache";
import {
  getProfileItems,
  createProfileItem,
  updateProfileItem,
  toggleProfileItemStatus,
} from "@/lib/profiles";

const PROFILE_TYPE = "department";

export async function getDepartmentProfileItems() {
  try {
    const data = await getProfileItems(PROFILE_TYPE);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to get department profiles" };
  }
}

export async function createDepartmentProfileItem(formData: FormData) {
  try {
    const name = formData.get("department")?.toString().trim();

    if (!name) {
      return { success: false, error: "Department name is required" };
    }

    const data = await createProfileItem(PROFILE_TYPE, { name });
    revalidatePath("/dashboard/master-profile/department");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create department profile" };
  }
}

export async function updateDepartmentProfileItem(id: string, formData: FormData) {
  try {
    // Currently name is immutable as per our schema, so update might just be status if we wanted to
    // But since there's no remark field, there's nothing to update from the form for now.
    // If we wanted to allow name updates we'd change immutableFields in profiles-schema.ts
    // For now we'll just return success.
    revalidatePath("/dashboard/master-profile/department");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update department profile" };
  }
}

export async function toggleDepartmentProfileStatus(id: string) {
  try {
    await toggleProfileItemStatus(PROFILE_TYPE, id);
    revalidatePath("/dashboard/master-profile/department");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle status" };
  }
}

export async function deleteDepartmentProfileItem(id: string) {
  try {
    // No soft delete in generic profiles yet, let's just toggle status as delete or hard delete via Prisma
    const { prisma } = await import("@/lib/prisma");
    await prisma.departmentProfile.delete({ where: { id } });
    revalidatePath("/dashboard/master-profile/department");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete department profile" };
  }
}
