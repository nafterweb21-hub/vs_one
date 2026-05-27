import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      companies,
      employees,
      workOrders,
      suppliers,
      currencies,
      taxes,
      uoms,
      mainProcesses,
      processProfiles,
    ] = await Promise.all([
      prisma.companyProfile.findMany({
        where: { status: "Active" },
        select: { id: true, companyName: true, allowPoForWo: true, rocNo: true, gstRegistrationNo: true, address: true },
        orderBy: { companyName: "asc" },
      }),
      prisma.employee.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true, email: true, code: true, designation: true },
        orderBy: { name: "asc" },
      }),
      prisma.workOrder.findMany({
        where: {
          status: {
            notIn: ["Void", "Cancelled"],
          },
        },
        select: { workOrderNo: true, jobDescription: true },
        orderBy: { workOrderNo: "desc" },
      }),
      prisma.supplierProfile.findMany({
        where: { status: "Active" },
        include: {
          contactPersons: {
            where: { status: "Active" },
            select: { id: true, contactPersonName: true, telNo: true, faxNo: true, mobileNo: true, email: true, isDefault: true, designation: true },
          },
        },
        orderBy: { supplierName: "asc" },
      }),
      prisma.currency.findMany({
        where: { status: "Active" },
        select: { id: true, code: true, name: true, exchangeRate: true, isDefault: true },
        orderBy: { code: "asc" },
      }),
      prisma.taxProfile.findMany({
        where: { status: "Active" },
        select: { id: true, taxType: true, taxRate: true },
        orderBy: { taxType: "asc" },
      }),
      prisma.uomProfile.findMany({
        where: { status: "Active" },
        select: { id: true, uomName: true },
        orderBy: { uomName: "asc" },
      }),
      prisma.mainProcess.findMany({
        where: { status: "Active" },
        select: { id: true, process: true },
        orderBy: { process: "asc" },
      }),
      prisma.processProfile.findMany({
        where: { status: "Active" },
        select: { id: true, routingProcess: true },
        orderBy: { routingProcess: "asc" },
      }),
    ]);

    return NextResponse.json({
      companies,
      employees,
      workOrders,
      suppliers,
      currencies,
      taxes,
      uoms,
      mainProcesses,
      processProfiles,
    });
  } catch (e: any) {
    console.error("PO Subcon form-data error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
