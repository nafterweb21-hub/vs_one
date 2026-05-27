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
        { rtnNo: { contains: search, mode: "insensitive" } },
        { remark: { contains: search, mode: "insensitive" } },
        { supplier: { supplierName: { contains: search, mode: "insensitive" } } },
        { purchaseOrder: { poNo: { contains: search, mode: "insensitive" } } },
        { goodsReceive: { grNo: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (!prisma.goodsReturn) {
      return NextResponse.json([]);
    }

    const items = await prisma.goodsReturn.findMany({
      where,
      orderBy: { rtnNo: "desc" },
      include: {
        company: { select: { companyName: true } },
        supplier: { select: { supplierName: true } },
        purchaseOrder: { select: { poNo: true } },
        goodsReceive: { select: { grNo: true } },
        creator: { select: { name: true } },
      },
    });

    return NextResponse.json(items);
  } catch (e: any) {
    console.error("GET GoodsReturn list error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Generate RTN No: RTN + last-2-digits-of-year + 5-digit sequence
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const prefix = `RTN${yy}`;

    if (!prisma.goodsReturn) {
      throw new Error("GoodsReturn model is not defined in Prisma schema.");
    }

    const latestRtn = await prisma.goodsReturn.findFirst({
      where: { rtnNo: { startsWith: prefix } },
      orderBy: { rtnNo: "desc" },
    });

    let nextNum = 1;
    if (latestRtn) {
      const currentNumStr = latestRtn.rtnNo.replace(prefix, "");
      const currentNum = parseInt(currentNumStr, 10);
      if (!isNaN(currentNum)) nextNum = currentNum + 1;
    }

    const rtnNo = `${prefix}${nextNum.toString().padStart(5, "0")}`;

    const { items, ...rtnData } = body;

    const newRtn = await prisma.goodsReturn.create({
      data: {
        ...rtnData,
        rtnNo,
        rtnDate: new Date(rtnData.rtnDate),
        status: "Draft",
        items: {
          create: (items || []).map((item: any) => ({
            goodsReceiveItemId: item.goodsReceiveItemId,
            returnQty: Number(item.returnQty),
            amount: Number(item.amount),
            internalQty: Number(item.internalQty),
            remark: item.remark || null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, id: newRtn.id }, { status: 201 });
  } catch (e: any) {
    console.error("POST GoodsReturn error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
