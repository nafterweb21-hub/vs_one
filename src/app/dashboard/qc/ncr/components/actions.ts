"use server";

import { prisma } from "@/lib/prisma";

export async function getNcrFormData() {
  const [customers, workOrders, employees, failureModeProfiles] = await Promise.all([
    prisma.customerProfile.findMany({
      where: { status: "Active" },
      orderBy: { customerName: "asc" },
      select: { id: true, customerName: true },
    }),
    prisma.workOrder.findMany({
      where: {
        status: { in: ["Proceed", "WIP", "Pending for QC"] },
      },
      orderBy: { workOrderNo: "desc" },
      select: { workOrderNo: true, customerPoRef: true, projectCode: true, jobDescription: true },
    }),
    prisma.employee.findMany({
      where: { status: "Active" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.failureModeProfile.findMany({
      where: { status: "Active" },
      orderBy: { failureMode: "asc" },
      select: { id: true, failureMode: true },
    }),
  ]);

  return {
    customers,
    workOrders,
    employees,
    failureModeProfiles,
  };
}
