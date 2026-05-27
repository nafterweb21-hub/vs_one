import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

const Prisma_Decimal = Prisma.Decimal;

export type QuotationStatus =
  | "Draft"
  | "Issued"
  | "Confirmed"
  | "Revised"
  | "Old Version"
  | "Void"
  | "Converted";

export async function nextQuotationNo(): Promise<string> {
  // Quotation No is shared across revisions; revision 0 is the originating row.
  const latest = await prisma.quotation.findFirst({
    where: { revision: 0 },
    orderBy: { quotationNo: "desc" },
    select: { quotationNo: true },
  });

  let next = 1;
  if (latest?.quotationNo) {
    const n = parseInt(latest.quotationNo.replace(/^Q/, ""), 10);
    if (!isNaN(n)) next = n + 1;
  }
  return `Q${String(next).padStart(5, "0")}`;
}

export type ItemInput = {
  unitPrice: number | string;
  quantity: number | string;
  sortOrder?: number;
  partId?: string | null;
  uomId?: string | null;
};

export function computeTotals(opts: {
  items: ItemInput[];
  lumpSumDisc: number | string;
  taxRate?: number | null;
}) {
  const subTotal = opts.items.reduce(
    (acc, it) => acc + Number(it.unitPrice || 0) * Number(it.quantity || 0),
    0,
  );
  const disc = Number(opts.lumpSumDisc || 0);
  const afterDisc = Math.max(0, subTotal - disc);
  const taxRate = opts.taxRate ?? 0;
  const taxAmount = +(afterDisc * (taxRate / 100)).toFixed(2);
  const totalAmount = +(afterDisc + taxAmount).toFixed(2);

  return {
    subTotal: +subTotal.toFixed(2),
    lumpSumDisc: +disc.toFixed(2),
    taxAmount,
    totalAmount,
  };
}

export type QuotationInput = {
  date: string | Date;
  salespersonId: string;
  customerId: string;
  contactPersonId?: string | null;
  customerPoRef?: string | null;
  refNo?: string | null;
  title: string;
  paymentTermId?: string | null;
  quoteValidityDays?: number;
  leadTime?: string | null;
  incoterms?: string | null;
  currencyId: string;
  exchangeRate: number | string;
  lumpSumDisc?: number | string;
  taxTypeId?: string | null;
  termsAndConditions?: string | null;
  remark?: string | null;
  uploadUrl?: string | null;
  items: ItemInput[];
};

const cleanId = (v: any) => (v === "" || v == null ? null : v);
const cleanStr = (v: any) => (v == null || v === "" ? null : String(v));

export async function createQuotation(input: QuotationInput) {
  if (!input.salespersonId) throw new Error("Salesperson is required");
  if (!input.customerId) throw new Error("Customer is required");
  if (!input.currencyId) throw new Error("Currency is required");
  if (!input.title?.trim()) throw new Error("Title is required");
  if (!input.items?.length) throw new Error("At least one line item is required");

  const tax = input.taxTypeId
    ? await prisma.taxProfile.findUnique({ where: { id: input.taxTypeId } })
    : null;

  const totals = computeTotals({
    items: input.items,
    lumpSumDisc: input.lumpSumDisc ?? 0,
    taxRate: tax?.taxRate ?? 0,
  });

  const quotationNo = await nextQuotationNo();

  return prisma.quotation.create({
    data: {
      quotationNo,
      revision: 0,
      status: "Draft",
      date: new Date(input.date),
      salespersonId: input.salespersonId,
      customerId: input.customerId,
      contactPersonId: cleanId(input.contactPersonId),
      customerPoRef: cleanStr(input.customerPoRef),
      refNo: cleanStr(input.refNo),
      title: input.title.trim(),
      paymentTermId: cleanId(input.paymentTermId),
      quoteValidityDays: input.quoteValidityDays ?? 60,
      leadTime: cleanStr(input.leadTime),
      incoterms: cleanStr(input.incoterms),
      currencyId: input.currencyId,
      exchangeRate: new Prisma_Decimal(input.exchangeRate),
      subTotal: new Prisma_Decimal(totals.subTotal),
      lumpSumDisc: new Prisma_Decimal(totals.lumpSumDisc),
      taxTypeId: cleanId(input.taxTypeId),
      taxRate: tax?.taxRate ?? null,
      taxAmount: tax ? new Prisma_Decimal(totals.taxAmount) : null,
      totalAmount: new Prisma_Decimal(totals.totalAmount),
      termsAndConditions: cleanStr(input.termsAndConditions),
      remark: cleanStr(input.remark),
      uploadUrl: cleanStr(input.uploadUrl),
      items: {
        create: input.items.map((it, idx) => ({
          unitPrice: new Prisma_Decimal(it.unitPrice ?? 0),
          quantity: Number(it.quantity) || 0,
          amount: new Prisma_Decimal(
            Number(it.unitPrice || 0) * Number(it.quantity || 0),
          ),
          sortOrder: it.sortOrder ?? idx,
          partId: cleanId(it.partId),
          uomId: cleanId(it.uomId),
        })),
      },
    },
    include: { items: true },
  });
}

export async function updateQuotation(id: string, input: QuotationInput) {
  const existing = await prisma.quotation.findUnique({ where: { id } });
  if (!existing) throw new Error("Quotation not found");
  if (existing.status !== "Draft")
    throw new Error("Only Draft quotations can be edited");

  const tax = input.taxTypeId
    ? await prisma.taxProfile.findUnique({ where: { id: input.taxTypeId } })
    : null;

  const totals = computeTotals({
    items: input.items,
    lumpSumDisc: input.lumpSumDisc ?? 0,
    taxRate: tax?.taxRate ?? 0,
  });

  return prisma.$transaction(async (tx) => {
    await tx.quotationItem.deleteMany({ where: { quotationId: id } });
    return tx.quotation.update({
      where: { id },
      data: {
        date: new Date(input.date),
        salespersonId: input.salespersonId,
        customerId: input.customerId,
        contactPersonId: cleanId(input.contactPersonId),
        customerPoRef: cleanStr(input.customerPoRef),
        refNo: cleanStr(input.refNo),
        title: input.title.trim(),
        paymentTermId: cleanId(input.paymentTermId),
        quoteValidityDays: input.quoteValidityDays ?? 60,
        leadTime: cleanStr(input.leadTime),
        incoterms: cleanStr(input.incoterms),
        currencyId: input.currencyId,
        exchangeRate: new Prisma_Decimal(input.exchangeRate),
        subTotal: new Prisma_Decimal(totals.subTotal),
        lumpSumDisc: new Prisma_Decimal(totals.lumpSumDisc),
        taxTypeId: cleanId(input.taxTypeId),
        taxRate: tax?.taxRate ?? null,
        taxAmount: tax ? new Prisma_Decimal(totals.taxAmount) : null,
        totalAmount: new Prisma_Decimal(totals.totalAmount),
        termsAndConditions: cleanStr(input.termsAndConditions),
        remark: cleanStr(input.remark),
        uploadUrl: cleanStr(input.uploadUrl),
        items: {
          create: input.items.map((it, idx) => ({
            unitPrice: new Prisma_Decimal(it.unitPrice ?? 0),
            quantity: Number(it.quantity) || 0,
            amount: new Prisma_Decimal(
              Number(it.unitPrice || 0) * Number(it.quantity || 0),
            ),
            sortOrder: it.sortOrder ?? idx,
            partId: cleanId(it.partId),
            uomId: cleanId(it.uomId),
          })),
        },
      },
      include: { items: true },
    });
  });
}

export async function transitionQuotation(
  id: string,
  action: "issue" | "confirm" | "void" | "revise" | "convertToSo",
) {
  const q = await prisma.quotation.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!q) throw new Error("Quotation not found");

  switch (action) {
    case "issue": {
      if (q.status !== "Draft") throw new Error("Only Draft can be issued");
      return prisma.quotation.update({
        where: { id },
        data: { status: "Issued" },
      });
    }
    case "confirm": {
      if (q.status !== "Issued" && q.status !== "Draft")
        throw new Error("Only Draft or Issued can be confirmed");
      return prisma.quotation.update({
        where: { id },
        data: { status: "Confirmed" },
      });
    }
    case "void": {
      if (q.status === "Converted")
        throw new Error("Cannot void a converted quotation");
      return prisma.quotation.update({
        where: { id },
        data: { status: "Void" },
      });
    }
    case "revise": {
      if (q.status !== "Confirmed" && q.status !== "Issued")
        throw new Error("Only Issued or Confirmed quotations can be revised");
      return prisma.$transaction(async (tx) => {
        await tx.quotation.update({
          where: { id },
          data: { status: "Old Version" },
        });
        const newRev = await tx.quotation.create({
          data: {
            quotationNo: q.quotationNo,
            revision: q.revision + 1,
            status: "Draft",
            date: new Date(),
            salespersonId: q.salespersonId,
            customerId: q.customerId,
            contactPersonId: q.contactPersonId,
            customerPoRef: q.customerPoRef,
            refNo: q.refNo,
            title: q.title,
            paymentTermId: q.paymentTermId,
            quoteValidityDays: q.quoteValidityDays,
            leadTime: q.leadTime,
            incoterms: q.incoterms,
            currencyId: q.currencyId,
            exchangeRate: q.exchangeRate,
            subTotal: q.subTotal,
            lumpSumDisc: q.lumpSumDisc,
            taxTypeId: q.taxTypeId,
            taxRate: q.taxRate,
            taxAmount: q.taxAmount,
            totalAmount: q.totalAmount,
            termsAndConditions: q.termsAndConditions,
            remark: q.remark,
            uploadUrl: q.uploadUrl,
            items: {
              create: q.items.map((it) => ({
                unitPrice: it.unitPrice,
                quantity: it.quantity,
                amount: it.amount,
                sortOrder: it.sortOrder,
                partId: it.partId,
                uomId: it.uomId,
              })),
            },
          },
        });
        return newRev;
      });
    }
    case "convertToSo": {
      if (q.status !== "Confirmed")
        throw new Error("Only Confirmed quotations can be converted to SO");
      if (q.salesOrderId) throw new Error("Already converted");

      const missing = q.items.filter((it) => !it.partId || !it.uomId);
      if (missing.length) {
        throw new Error(
          `Cannot convert: ${missing.length} line item(s) are missing Finished Good or UOM. Edit the quotation and set both for every line before converting.`,
        );
      }

      return prisma.$transaction(async (tx) => {
        const currentYear = new Date().getFullYear();
        const count = await tx.salesOrder.count({
          where: { orderNo: { startsWith: `SO-${currentYear}-` } },
        });
        const orderNo = `SO-${currentYear}-${String(count + 1).padStart(4, "0")}`;

        const internalQuotationNo = `${q.quotationNo}-R${q.revision}`;

        const so = await tx.salesOrder.create({
          data: {
            orderNo,
            revision: 0,
            status: "Draft",
            date: new Date(),
            salespersonId: q.salespersonId,
            customerId: q.customerId,
            customerPoRef: q.customerPoRef,
            paymentTermId: q.paymentTermId ?? (await firstPaymentTermId(tx)),
            currencyId: q.currencyId,
            exchangeRate: q.exchangeRate,
            amountBeforeTax: q.subTotal,
            taxTypeId: q.taxTypeId,
            taxRate: q.taxRate,
            taxAmount: q.taxAmount,
            amountAfterTax: q.totalAmount,
            contactPersonId: q.contactPersonId,
            email: null,
            remark: q.remark,
            items: {
              create: q.items.map((it) => ({
                partId: it.partId!,
                uomId: it.uomId!,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                internalQuotationNo,
              })),
            },
          },
        });

        await tx.quotation.update({
          where: { id },
          data: { salesOrderId: so.id, status: "Converted" },
        });

        return so;
      });
    }
  }
}

async function firstPaymentTermId(tx: Prisma.TransactionClient): Promise<string> {
  const pt = await tx.paymentTermProfile.findFirst({
    where: { status: "Active" },
    select: { id: true },
  });
  if (!pt)
    throw new Error(
      "Cannot convert: SO requires a Payment Term and the quotation has none and no active default exists",
    );
  return pt.id;
}

