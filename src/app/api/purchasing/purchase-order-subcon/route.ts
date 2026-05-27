import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "All";

    const where: any = {
      poType: "Subcon"
    };

    if (status !== "All") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { poNo: { contains: search, mode: "insensitive" } },
        { remark: { contains: search, mode: "insensitive" } },
        { workOrderNo: { contains: search, mode: "insensitive" } },
        { purchaser: { name: { contains: search, mode: "insensitive" } } },
        { supplier: { supplierName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const items = await prisma.purchaseOrder.findMany({
      where,
      orderBy: [{ poNo: "desc" }, { revision: "desc" }],
      include: {
        company: { select: { companyName: true } },
        supplier: { select: { supplierName: true } },
        purchaser: { select: { name: true } },
        workOrder: { select: { jobDescription: true } },
      },
    });

    return NextResponse.json(items);
  } catch (e: any) {
    console.error("GET PO Subcon list error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return await prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear().toString().slice(2);
      const prefix = `PO${year}`;

      const latest = await tx.purchaseOrder.findFirst({
        where: { poNo: { startsWith: prefix } },
        orderBy: { poNo: "desc" },
      });

      let nextRunning = 1;
      if (latest) {
        const match = latest.poNo.match(/PO\d{2}(\d{5})/);
        if (match) {
          nextRunning = parseInt(match[1], 10) + 1;
        }
      }

      const poNo = `${prefix}${nextRunning.toString().padStart(5, "0")}`;

      const po = await tx.purchaseOrder.create({
        data: {
          poNo,
          poType: "Subcon",
          revision: 0,
          date: new Date(body.date),
          companyId: body.companyId,
          supplierId: body.supplierId,
          workOrderNo: body.workOrderNo || null,
          currencyId: body.currencyId,
          exchangeRate: body.exchangeRate,
          taxTypeId: body.taxTypeId,
          taxRate: body.taxRate,
          amountBeforeTax: body.amountBeforeTax || 0,
          taxAmount: body.taxAmount || 0,
          amountAfterTax: body.amountAfterTax || 0,
          millCertificate: body.millCertificate || false,
          certOfConformance: body.certOfConformance || false,
          contactPersonId: body.contactPersonId,
          telNo: body.telNo || "",
          faxNo: body.faxNo || "",
          mobileNo: body.mobileNo || "",
          email: body.email || "",
          receiveStatus: "NA",
          purchaserId: body.purchaserId,
          remark: body.remark || "",
          status: "Draft",
          items: {
            create: (body.items || []).map((it: any, i: number) => ({
              description: it.description || "",
              quantity: it.quantity || 0,
              poUomId: it.poUomId,
              unitPrice: it.unitPrice || 0,
              amount: it.amount || 0,
              conversion: 1, // Not used but required
              inProcessId: it.inProcessId || null,
              mainProcessId: it.mainProcessId || null,
              processProfileId: it.processProfileId || null,
              routingProcessId: it.routingProcessId || null,
              hardness: it.hardness || "",
              thickness: it.thickness || "",
              deliveryDate: it.deliveryDate ? new Date(it.deliveryDate) : new Date(),
              remark: it.remark || "",
              sortOrder: i,
            })),
          },
        },
      });

      return NextResponse.json(po);
    });
  } catch (e: any) {
    console.error("Create PO Subcon error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
