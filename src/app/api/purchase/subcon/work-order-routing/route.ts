import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workOrderNo = searchParams.get("workOrderNo");

  if (!workOrderNo) {
    return NextResponse.json({ error: "Work Order No is required" }, { status: 400 });
  }

  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { workOrderNo },
      include: {
        inProcesses: {
          include: {
            routingProcesses: {
              include: {
                mainProcess: true,
                routingProcess: true,
              },
            },
          },
        },
      },
    });

    if (!workOrder) {
      return NextResponse.json({ inProcesses: [] });
    }

    return NextResponse.json({ inProcesses: workOrder.inProcesses });
  } catch (error: any) {
    console.error("Error fetching work order routing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
