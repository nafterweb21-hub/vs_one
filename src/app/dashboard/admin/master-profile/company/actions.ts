"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCompanies() {
  return await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export type CompanyData = {
  name: string;
  address: string;
  phoneNo: string;
  faxNo: string;
  email: string | null;
  website: string | null;
  rocNo: string | null;
  gstRegistrationNo: string;
  uploadUrl: string;
  logoUrl: string | null;
  footerUrl: string | null;
  logoName: string;
  footerName: string;
  allowCreatePoForWo: boolean;
  as9100RequirementNote: boolean;
};

export async function createCompany(data: CompanyData) {
  try {
    const existing = await prisma.company.findUnique({
      where: { name: data.name },
    });
    
    if (existing) {
      return { success: false, error: "Company Name must be unique." };
    }

    await prisma.company.create({
      data,
    });

    revalidatePath("/dashboard/admin/master-profile/company");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating company:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create company" };
  }
}

export async function updateCompany(id: string, data: Partial<CompanyData>) {
  try {
    if (data.name) {
      const existing = await prisma.company.findUnique({
        where: { name: data.name },
      });
      if (existing && existing.id !== id) {
        return { success: false, error: "Company Name must be unique." };
      }
    }

    await prisma.company.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/admin/master-profile/company");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating company:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update company" };
  }
}

export async function deleteCompany(id: string) {
  try {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) return { success: false, error: "Company not found" };

    await prisma.company.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/master-profile/company");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting company:", error);
    return { success: false, error: "Failed to delete company" };
  }
}

export async function updateCompanyStatus(id: string, newStatus: string) {
  try {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) return { success: false, error: "Company not found" };

    await prisma.company.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/admin/master-profile/company");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating company status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
