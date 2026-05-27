import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const workOrderNo = url.searchParams.get("workOrderNo");

    if (!workOrderNo) {
      return NextResponse.json([]);
    }

    const inProcesses = await prisma.workOrderInProcess.findMany({
      where: { workOrderNo },
      include: {
        routingProcesses: {
          include: {
            routingProcess: true,
          }
        },
      }
    });

    return NextResponse.json(inProcesses);
  } catch (e: any) {
    console.error("GET WO Processes error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
