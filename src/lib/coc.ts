import { prisma } from "@/lib/prisma";

// Generate COCYYXXXXX
export async function generateCocNo(year: number): Promise<string> {
  // Use a transaction to safely increment the sequence
  const sequence = await prisma.$transaction(async (tx) => {
    let seq = await tx.cocSequence.findUnique({
      where: { id: "coc-sequence" },
    });

    if (!seq || seq.year !== year) {
      // Reset or create for new year
      seq = await tx.cocSequence.upsert({
        where: { id: "coc-sequence" },
        update: { year: year, lastValue: 1 },
        create: { id: "coc-sequence", year: year, lastValue: 1 },
      });
    } else {
      // Increment
      seq = await tx.cocSequence.update({
        where: { id: "coc-sequence" },
        data: { lastValue: { increment: 1 } },
      });
    }
    return seq;
  });

  const yy = String(year).slice(-2);
  const xxxxx = String(sequence.lastValue).padStart(5, "0");
  return `COC${yy}${xxxxx}`;
}

export async function getCocs() {
  return prisma.certificateOfConformity.findMany({
    include: {
      customer: true,
      deliveryOrder: true,
      workOrder: true,
      checkedBy: true,
      approvedBy: true,
      cocType: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCocById(id: string) {
  return prisma.certificateOfConformity.findUnique({
    where: { id },
    include: {
      customer: true,
      deliveryOrder: true,
      workOrder: true,
      woUom: true,
      doUom: true,
      cocUom: true,
      welder: true,
      weldingMachine: true,
      painter: true,
      checkedBy: true,
      approvedBy: true,
      cocType: true,
    },
  });
}

export async function createCoc(data: any) {
  const currentYear = new Date(data.date).getFullYear() || new Date().getFullYear();
  const cocNo = await generateCocNo(currentYear);

  return prisma.certificateOfConformity.create({
    data: {
      ...data,
      cocNo,
    },
  });
}

export async function updateCoc(id: string, data: any) {
  return prisma.certificateOfConformity.update({
    where: { id },
    data,
  });
}

export async function checkCoc(id: string, userId: string) {
  return prisma.certificateOfConformity.update({
    where: { id },
    data: {
      status: "Require Approval",
      checkedById: userId,
    },
  });
}

export async function approveCoc(id: string, userId: string) {
  return prisma.certificateOfConformity.update({
    where: { id },
    data: {
      status: "Approved",
      approvedById: userId,
    },
  });
}

export async function deleteCoc(id: string) {
  return prisma.certificateOfConformity.delete({ where: { id } });
}
