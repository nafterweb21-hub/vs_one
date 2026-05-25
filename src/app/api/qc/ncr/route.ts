import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";

    const where: any = {};

    if (status !== "All") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { ncrNo: { contains: search, mode: "insensitive" } },
        { customer: { customerName: { contains: search, mode: "insensitive" } } },
        { workOrderNo: { contains: search, mode: "insensitive" } },
      ];
    }

    const ncrs = await prisma.ncr.findMany({
      where,
      include: {
        customer: true,
        requestor: true,
        responsibleParty: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ncrs);
  } catch (error: any) {
    console.error("GET /api/qc/ncr error:", error);
    return NextResponse.json({ error: "Failed to fetch NCRs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate NCR No: NCRYYYYMMXX
    const date = new Date(body.ncrDate || new Date());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const prefix = `NCR${year}${month}`;

    // Find highest running number for this month
    const latestNcr = await prisma.ncr.findFirst({
      where: {
        ncrNo: {
          startsWith: prefix,
        },
      },
      orderBy: {
        ncrNo: "desc",
      },
    });

    let runningNo = 1;
    if (latestNcr && latestNcr.ncrNo) {
      const lastDigits = latestNcr.ncrNo.replace(prefix, "");
      runningNo = parseInt(lastDigits, 10) + 1;
    }

    const ncrNo = `${prefix}${String(runningNo).padStart(2, "0")}`;

    // Extract failure modes to create join table entries
    const failureModeIds = body.failureModeIds || [];
    delete body.failureModeIds;

    const newNcr = await prisma.ncr.create({
      data: {
        ...body,
        ncrNo,
        failureModes: {
          create: failureModeIds.map((id: string) => ({
            failureMode: { connect: { id } }
          }))
        }
      },
      include: {
        customer: true,
        failureModes: {
          include: { failureMode: true }
        }
      }
    });

    return NextResponse.json(newNcr);
  } catch (error: any) {
    console.error("POST /api/qc/ncr error:", error);
    return NextResponse.json({ error: error.message || "Failed to create NCR" }, { status: 500 });
  }
}
