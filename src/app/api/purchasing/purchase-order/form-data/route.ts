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
      materials,
      purchaseRequisitions,
    ] = await Promise.all([
      prisma.companyProfile.findMany({
        where: { status: "Active" },
        select: { id: true, companyName: true, allowPoForWo: true },
        orderBy: { companyName: "asc" },
      }),
      prisma.employee.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true, email: true, code: true },
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
          SupplierContactPerson: {
            where: { status: "Active" },
            select: { id: true, contactPersonName: true, telNo: true, faxNo: true, mobileNo: true, email: true, isDefault: true },
          },
        },
        orderBy: { supplierName: "asc" },
      }).then(res => res.map(s => ({ ...s, contactPersons: s.SupplierContactPerson }))),
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
      prisma.materialProfile.findMany({
        where: { status: "Active" },
        select: { id: true, partNo: true, description: true, shape: true, size: true },
        orderBy: { description: "asc" },
      }),
      prisma.purchaseRequisition.findMany({
        where: {
          status: "Submitted", // Only submitted PRs can be converted to POs? Or Approved? Assuming Submitted based on previous schema comments.
        },
        include: {
          items: {
            include: {
              uom: true,
              materialProfile: true,
            },
          },
        },
        orderBy: { prNo: "desc" },
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
      materials,
      purchaseRequisitions,
    });
  } catch (e: any) {
    console.error("PO form-data error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
