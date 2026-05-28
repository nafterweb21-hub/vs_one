import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "All";

    const where: any = {};

    if (status !== "All") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { srfNo: { contains: search, mode: "insensitive" } },
        { remark: { contains: search, mode: "insensitive" } },
        {
          purchaseOrderItem: {
            purchaseOrder: {
              poNo: { contains: search, mode: "insensitive" },
              supplier: { supplierName: { contains: search, mode: "insensitive" } },
              company: { companyName: { contains: search, mode: "insensitive" } }
            }
          }
        },
      ];
    }

    const items = await prisma.subconRequestForm.findMany({
      where,
      orderBy: { srfNo: "desc" },
      include: {
        outsourcedBy: { select: { name: true } },
        receivedBy: { select: { contactPersonName: true } },
        purchaseOrderItem: {
          include: {
            purchaseOrder: {
              include: {
                company: { select: { companyName: true } },
                supplier: { select: { supplierName: true } },
                currency: { select: { code: true } },
              }
            },
            poUom: { select: { uomName: true } },
            masterMainProcess: { select: { process: true } },
            masterRoutingProcess: { select: { routingProcess: true } },
          }
        }
      },
    });

    return NextResponse.json(items);
  } catch (e: any) {
    console.error("GET SRF list error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return await prisma.$transaction(async (tx) => {
      // Auto Generate SRFYYXXXXX
      const year = new Date().getFullYear().toString().slice(2);
      const prefix = `SRF${year}`;

      const latest = await tx.subconRequestForm.findFirst({
        where: { srfNo: { startsWith: prefix } },
        orderBy: { srfNo: "desc" },
      });

      let nextRunning = 1;
      if (latest) {
        const match = latest.srfNo.match(/SRF\d{2}(\d{5})/);
        if (match) {
          nextRunning = parseInt(match[1], 10) + 1;
        }
      }

      const srfNo = `${prefix}${nextRunning.toString().padStart(5, "0")}`;

      const form = await tx.subconRequestForm.create({
        data: {
          srfNo,
          srfDate: new Date(body.srfDate),
          purchaseOrderItemId: body.purchaseOrderItemId,
          outsourcedById: body.outsourcedById,
          dateRequired: new Date(body.dateRequired),
          receivedById: body.receivedById || null,
          quantity: body.quantity,
          remark: body.remark || "",
          status: "Draft",
          receiveStatus: "N/A",
        },
      });

      return NextResponse.json(form);
    });
  } catch (e: any) {
    console.error("Create SRF error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
