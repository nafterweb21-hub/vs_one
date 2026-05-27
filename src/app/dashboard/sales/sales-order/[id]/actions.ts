"use server";

import { prisma } from "@/lib/prisma";

export async function getFormData() {
  try {
    const [
      employees,
      customers,
      paymentTerms,
      currencies,
      taxes,
      finishedGoods,
      uoms,
    ] = await Promise.all([
      prisma.employee.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true, code: true } }),
      prisma.customerProfile.findMany({ where: { status: "Active" }, select: { id: true, customerName: true, customerCode: true, contactPersons: true, addresses: true } }),
      prisma.paymentTermProfile.findMany({ where: { status: "Active" }, select: { id: true, name: true, days: true } }),
      prisma.currency.findMany({ where: { status: "Active" }, select: { id: true, code: true, exchangeRate: true } }),
      prisma.taxProfile.findMany({ where: { status: "Active" }, select: { id: true, taxType: true, taxRate: true } }),
      prisma.finishedGoodProfile.findMany({ where: { status: "Active" }, select: { id: true, partNo: true, description: true } }),
      prisma.uomProfile.findMany({ where: { status: "Active" }, select: { id: true, uomName: true } }),
    ]);

    return {
      employees,
      customers,
      paymentTerms,
      currencies: currencies.map(c => ({ ...c, exchangeRate: Number(c.exchangeRate) })),
      taxes,
      finishedGoods,
      uoms,
    };
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw new Error("Failed to load prerequisite data");
  }
}
