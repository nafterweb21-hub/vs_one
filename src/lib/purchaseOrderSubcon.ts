import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

const Prisma_Decimal = Prisma.Decimal;

export type PoSubconStatus =
  | "Draft"
  | "Pending For Approval"
  | "Rejected"
  | "Approved"
  | "Issued"
  | "Void"
  | "Revised"
  | "Old Version";

export async function nextPoSubconNo(): Promise<string> {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  
  const latest = await prisma.purchaseOrderSubcon.findFirst({
    where: { 
      revision: 0,
      poNo: { startsWith: `PO${currentYear}` }
    },
    orderBy: { poNo: "desc" },
    select: { poNo: true },
  });

  let next = 1;
  if (latest?.poNo) {
    const n = parseInt(latest.poNo.slice(4), 10);
    if (!isNaN(n)) next = n + 1;
  }
  return `PO${currentYear}${String(next).padStart(5, "0")}`;
}

export type PoSubconItemInput = {
  description: string;
  quantity: number | string;
  uomId: string;
  unitPrice: number | string;
  inProcessId?: string | null;
  mainProcessId?: string | null;
  routingProcessId?: string | null;
  hardness?: string | null;
  thickness?: string | null;
  deliveryDate: string | Date;
  remark?: string | null;
};

export type PoSubconInput = {
  poDate: string | Date;
  companyId?: string | null;
  purchaserId: string;
  supplierId: string;
  workOrderNo?: string | null;
  currencyId: string;
  exchangeRate: number | string;
  taxTypeId?: string | null;
  millCert?: boolean;
  certOfConformance?: boolean;
  contactPersonId?: string | null;
  tel?: string | null;
  fax?: string | null;
  mobile?: string | null;
  email?: string | null;
  poRemark?: string | null;
  items: PoSubconItemInput[];
};

export function computePoSubconTotals(opts: {
  items: PoSubconItemInput[];
  taxRate?: number | null;
}) {
  const amountBeforeTax = opts.items.reduce(
    (acc, it) => acc + Number(it.unitPrice || 0) * Number(it.quantity || 0),
    0
  );
  const taxRate = opts.taxRate ?? 0;
  const taxAmount = +(amountBeforeTax * (taxRate / 100)).toFixed(2);
  const amountAfterTax = +(amountBeforeTax + taxAmount).toFixed(2);

  return {
    amountBeforeTax: +amountBeforeTax.toFixed(2),
    taxAmount,
    amountAfterTax,
  };
}

const cleanId = (v: any) => (v === "" || v == null ? null : v);
const cleanStr = (v: any) => (v == null || v === "" ? null : String(v));

export async function createPurchaseOrderSubcon(input: PoSubconInput) {
  if (!input.purchaserId) throw new Error("Purchaser is required");
  if (!input.supplierId) throw new Error("Supplier is required");
  if (!input.currencyId) throw new Error("Currency is required");
  if (!input.items?.length) throw new Error("At least one line item is required");

  const tax = input.taxTypeId
    ? await prisma.taxProfile.findUnique({ where: { id: input.taxTypeId } })
    : null;

  const totals = computePoSubconTotals({
    items: input.items,
    taxRate: tax?.taxRate ?? 0,
  });

  const poNo = await nextPoSubconNo();

  return prisma.purchaseOrderSubcon.create({
    data: {
      poNo,
      revision: 0,
      status: "Draft",
      poDate: new Date(input.poDate),
      companyId: cleanId(input.companyId),
      purchaserId: input.purchaserId,
      supplierId: input.supplierId,
      workOrderNo: cleanStr(input.workOrderNo),
      currencyId: input.currencyId,
      exchangeRate: new Prisma_Decimal(input.exchangeRate),
      amountBeforeTax: new Prisma_Decimal(totals.amountBeforeTax),
      taxTypeId: cleanId(input.taxTypeId),
      taxRate: tax?.taxRate ?? null,
      taxAmount: tax ? new Prisma_Decimal(totals.taxAmount) : null,
      amountAfterTax: new Prisma_Decimal(totals.amountAfterTax),
      millCert: input.millCert ?? false,
      certOfConformance: input.certOfConformance ?? false,
      contactPersonId: cleanId(input.contactPersonId),
      tel: cleanStr(input.tel),
      fax: cleanStr(input.fax),
      mobile: cleanStr(input.mobile),
      email: cleanStr(input.email),
      poRemark: cleanStr(input.poRemark),
      items: {
        create: input.items.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity) || 0,
          uomId: cleanId(it.uomId)!,
          unitPrice: new Prisma_Decimal(it.unitPrice ?? 0),
          amount: new Prisma_Decimal(
            Number(it.unitPrice || 0) * Number(it.quantity || 0)
          ),
          inProcessId: cleanId(it.inProcessId),
          mainProcessId: cleanId(it.mainProcessId),
          routingProcessId: cleanId(it.routingProcessId),
          hardness: cleanStr(it.hardness),
          thickness: cleanStr(it.thickness),
          deliveryDate: new Date(it.deliveryDate),
          remark: cleanStr(it.remark),
        })),
      },
    },
    include: { items: true },
  });
}

export async function updatePurchaseOrderSubcon(id: string, input: PoSubconInput) {
  const existing = await prisma.purchaseOrderSubcon.findUnique({ where: { id } });
  if (!existing) throw new Error("Purchase Order Subcon not found");
  if (existing.status !== "Draft" && existing.status !== "Rejected")
    throw new Error("Only Draft or Rejected POs can be edited");

  const tax = input.taxTypeId
    ? await prisma.taxProfile.findUnique({ where: { id: input.taxTypeId } })
    : null;

  const totals = computePoSubconTotals({
    items: input.items,
    taxRate: tax?.taxRate ?? 0,
  });

  return prisma.$transaction(async (tx) => {
    await tx.purchaseOrderSubconItem.deleteMany({ where: { purchaseOrderSubconId: id } });
    return tx.purchaseOrderSubcon.update({
      where: { id },
      data: {
        poDate: new Date(input.poDate),
        companyId: cleanId(input.companyId),
        purchaserId: input.purchaserId,
        supplierId: input.supplierId,
        workOrderNo: cleanStr(input.workOrderNo),
        currencyId: input.currencyId,
        exchangeRate: new Prisma_Decimal(input.exchangeRate),
        amountBeforeTax: new Prisma_Decimal(totals.amountBeforeTax),
        taxTypeId: cleanId(input.taxTypeId),
        taxRate: tax?.taxRate ?? null,
        taxAmount: tax ? new Prisma_Decimal(totals.taxAmount) : null,
        amountAfterTax: new Prisma_Decimal(totals.amountAfterTax),
        millCert: input.millCert ?? false,
        certOfConformance: input.certOfConformance ?? false,
        contactPersonId: cleanId(input.contactPersonId),
        tel: cleanStr(input.tel),
        fax: cleanStr(input.fax),
        mobile: cleanStr(input.mobile),
        email: cleanStr(input.email),
        poRemark: cleanStr(input.poRemark),
        status: "Draft",
        approval1ById: null,
        approval1Date: null,
        approval2ById: null,
        approval2Date: null,
        items: {
          create: input.items.map((it) => ({
            description: it.description,
            quantity: Number(it.quantity) || 0,
            uomId: cleanId(it.uomId)!,
            unitPrice: new Prisma_Decimal(it.unitPrice ?? 0),
            amount: new Prisma_Decimal(
              Number(it.unitPrice || 0) * Number(it.quantity || 0)
            ),
            inProcessId: cleanId(it.inProcessId),
            mainProcessId: cleanId(it.mainProcessId),
            routingProcessId: cleanId(it.routingProcessId),
            hardness: cleanStr(it.hardness),
            thickness: cleanStr(it.thickness),
            deliveryDate: new Date(it.deliveryDate),
            remark: cleanStr(it.remark),
          })),
        },
      },
      include: { items: true },
    });
  });
}

export async function transitionPurchaseOrderSubcon(
  id: string,
  action: "submit" | "approve1" | "approve2" | "reject" | "issue" | "void" | "revise",
  userId: string
) {
  const po = await prisma.purchaseOrderSubcon.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!po) throw new Error("Purchase Order not found");

  switch (action) {
    case "submit": {
      if (po.status !== "Draft" && po.status !== "Rejected")
        throw new Error("Only Draft or Rejected PO can be submitted for approval");
      return prisma.purchaseOrderSubcon.update({
        where: { id },
        data: { status: "Pending For Approval" },
      });
    }
    case "approve1": {
      if (po.status !== "Pending For Approval")
        throw new Error("PO is not pending approval");
      
      // Determine if a second approval is needed based on amount logic
      // Simplification for now: let frontend decide or just set to Approved.
      // We will set status to Approved directly if it doesn't need 2nd approval, 
      // but let's assume if action="approve1", it means we approve tier 1.
      // If we need tier 2, status remains "Pending For Approval", but we mark approval1ById.
      // Actually let's assume caller knows what to do and we just record it.
      return prisma.purchaseOrderSubcon.update({
        where: { id },
        data: {
          approval1ById: userId,
          approval1Date: new Date(),
          status: "Approved", // If 2 tiers needed, another endpoint or logic handles it
        },
      });
    }
    case "approve2": {
      if (po.status !== "Pending For Approval" && po.status !== "Approved")
        throw new Error("PO is not pending 2nd approval");
      return prisma.purchaseOrderSubcon.update({
        where: { id },
        data: {
          approval2ById: userId,
          approval2Date: new Date(),
          status: "Approved",
        },
      });
    }
    case "reject": {
      if (po.status !== "Pending For Approval")
        throw new Error("Only pending PO can be rejected");
      return prisma.purchaseOrderSubcon.update({
        where: { id },
        data: { status: "Rejected" },
      });
    }
    case "issue": {
      if (po.status !== "Approved")
        throw new Error("Only Approved PO can be issued");
      return prisma.purchaseOrderSubcon.update({
        where: { id },
        data: { status: "Issued" },
      });
    }
    case "void": {
      return prisma.purchaseOrderSubcon.update({
        where: { id },
        data: { status: "Void" },
      });
    }
    case "revise": {
      if (po.status !== "Issued" && po.status !== "Approved")
        throw new Error("Only Issued or Approved POs can be revised");
      return prisma.$transaction(async (tx) => {
        await tx.purchaseOrderSubcon.update({
          where: { id },
          data: { status: "Old Version" },
        });
        const newRev = await tx.purchaseOrderSubcon.create({
          data: {
            poNo: po.poNo,
            revision: po.revision + 1,
            status: "Draft",
            poDate: new Date(),
            companyId: po.companyId,
            purchaserId: po.purchaserId,
            supplierId: po.supplierId,
            workOrderNo: po.workOrderNo,
            currencyId: po.currencyId,
            exchangeRate: po.exchangeRate,
            amountBeforeTax: po.amountBeforeTax,
            taxTypeId: po.taxTypeId,
            taxRate: po.taxRate,
            taxAmount: po.taxAmount,
            amountAfterTax: po.amountAfterTax,
            millCert: po.millCert,
            certOfConformance: po.certOfConformance,
            contactPersonId: po.contactPersonId,
            tel: po.tel,
            fax: po.fax,
            mobile: po.mobile,
            email: po.email,
            poRemark: po.poRemark,
            items: {
              create: po.items.map((it) => ({
                description: it.description,
                quantity: it.quantity,
                uomId: it.uomId,
                unitPrice: it.unitPrice,
                amount: it.amount,
                inProcessId: it.inProcessId,
                mainProcessId: it.mainProcessId,
                routingProcessId: it.routingProcessId,
                hardness: it.hardness,
                thickness: it.thickness,
                deliveryDate: it.deliveryDate,
                remark: it.remark,
              })),
            },
          },
        });
        return newRev;
      });
    }
  }
}
