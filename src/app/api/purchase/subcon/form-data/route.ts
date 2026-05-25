import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextPoSubconNo } from "@/lib/purchaseOrderSubcon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nextPoNo = await nextPoSubconNo();
    const [companyProfiles, employees, supplierProfiles, currencies, taxProfiles, uomProfiles, workOrders] = await Promise.all([
      prisma.companyProfile.findMany({
        where: { status: "Active" },
        select: { id: true, companyName: true },
        orderBy: { companyName: "asc" },
      }),
      prisma.employee.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.supplierProfile.findMany({
        where: { status: "Active" },
        select: { 
          id: true, 
          supplierName: true,
          contactPersons: {
            where: { status: "Active" },
            select: { id: true, contactPersonName: true, isDefault: true, telNo: true, mobileNo: true, faxNo: true, email: true, designation: true }
          }
        },
        orderBy: { supplierName: "asc" },
      }),
      prisma.currency.findMany({
        where: { status: "Active" },
        select: { id: true, code: true, name: true, exchangeRate: true },
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
      prisma.workOrder.findMany({
        where: { status: { not: "Void" } },
        select: { workOrderNo: true, jobDescription: true },
        orderBy: { date: "desc" },
      }),
    ]);

    return NextResponse.json({
      companyProfiles,
      employees,
      supplierProfiles,
      currencies: currencies.map((c) => ({ ...c, exchangeRate: Number(c.exchangeRate) })),
      taxProfiles,
      uomProfiles,
      workOrders,
      nextPoNo,
    });
  } catch (e: any) {
    console.error("PO Subcon form-data:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
