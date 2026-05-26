import { prisma } from "@/lib/prisma";

export async function getCocTypes() {
  return await prisma.cocTypeProfile.findMany({
    orderBy: { type: "asc" },
  });
}

export async function createCocType(data: { type: string; remark?: string }) {
  const existing = await prisma.cocTypeProfile.findUnique({
    where: { type: data.type },
  });
  if (existing) {
    throw new Error("COC Type already exists.");
  }

  return await prisma.cocTypeProfile.create({
    data: {
      type: data.type,
      remark: data.remark || "",
      status: "Active",
    },
  });
}

export async function updateCocType(
  id: string,
  data: { remark?: string; status?: string }
) {
  return await prisma.cocTypeProfile.update({
    where: { id },
    data,
  });
}

export async function deleteCocType(id: string) {
  // Check if it's in use
  const inUse = await prisma.certificateOfConformity.findFirst({
    where: { cocTypeId: id },
  });

  if (inUse) {
    throw new Error("Cannot delete COC Type as it is currently in use by a COC.");
  }

  return await prisma.cocTypeProfile.delete({
    where: { id },
  });
}
