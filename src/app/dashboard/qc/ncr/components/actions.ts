"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getNcrFormData() {
  const session = await auth();
  const [customers, workOrders, employees, failureModeProfiles, departmentProfiles] = await Promise.all([
    prisma.customerProfile.findMany({
      where: { status: { in: ["Active", "ACTIVE"] } },
      orderBy: { customerName: "asc" },
      select: { id: true, customerName: true },
    }),
    prisma.workOrder.findMany({
      orderBy: { workOrderNo: "desc" },
      select: { workOrderNo: true, customerPoRef: true, projectCode: true, jobDescription: true },
    }),
    prisma.employee.findMany({
      where: { status: { in: ["Active", "ACTIVE"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.failureModeProfile.findMany({
      where: { status: { in: ["Active", "ACTIVE"] } },
      orderBy: { failureMode: "asc" },
      select: { id: true, failureMode: true },
    }),
    prisma.departmentProfile.findMany({
      where: { status: { in: ["Active", "ACTIVE"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return {
    customers,
    workOrders,
    employees,
    failureModeProfiles,
    departmentProfiles,
    loggedInEmployeeId: session?.user?.employeeId || null,
  };
}
