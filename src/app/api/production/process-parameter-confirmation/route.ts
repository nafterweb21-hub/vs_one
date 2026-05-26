import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const commonTimesheetInclude = {
      employee: {
        select: {
          name: true,
          code: true,
        },
      },
      routingProcess: {
        include: {
          inProcess: {
            include: {
              workOrder: {
                include: {
                  customer: {
                    select: {
                      customerName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const weldingParams = await prisma.processParameterWelding.findMany({
      where: {
        confirmedById: null,
      },
      include: {
        timesheet: {
          include: commonTimesheetInclude,
        },
        weldingMachine: true,
        typeOfJoint: true,
        materialTypes: true,
        weldingTypes: true,
      },
    });

    const sprayPaintingParams = await prisma.processParameterSprayPainting.findMany({
      where: {
        confirmedById: null,
      },
      include: {
        timesheet: {
          include: commonTimesheetInclude,
        },
        elcometer: true,
      },
    });

    const machiningParams = await prisma.processParameterMachining.findMany({
      where: {
        confirmedById: null,
      },
      include: {
        timesheet: {
          include: commonTimesheetInclude,
        },
        machine: true,
        toolLists: true,
      },
    });

    return NextResponse.json({
      welding: weldingParams,
      sprayPainting: sprayPaintingParams,
      machining: machiningParams,
    });
  } catch (error) {
    console.error("Error fetching pending process parameters:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending process parameters" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { type, updates } = body;

    if (!type || !updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const confirmedDate = new Date();

    // Perform sequential or parallel updates
    if (type === "welding") {
      await Promise.all(
        updates.map((update: any) =>
          prisma.processParameterWelding.update({
            where: { id: update.id },
            data: {
              confirmedById: update.confirmedById,
              confirmedDate,
              status: "Confirmed",
            },
          })
        )
      );
    } else if (type === "sprayPainting") {
      await Promise.all(
        updates.map((update: any) =>
          prisma.processParameterSprayPainting.update({
            where: { id: update.id },
            data: {
              confirmedById: update.confirmedById,
              confirmedDate,
              status: "Confirmed",
              ...(update.elcometerSerialNoId && { elcometerSerialNoId: update.elcometerSerialNoId }),
            },
          })
        )
      );
    } else if (type === "machining") {
      await Promise.all(
        updates.map((update: any) =>
          prisma.processParameterMachining.update({
            where: { id: update.id },
            data: {
              confirmedById: update.confirmedById,
              confirmedDate,
              status: "Confirmed",
            },
          })
        )
      );
    } else {
      return NextResponse.json({ error: "Invalid process parameter type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Parameters confirmed successfully" });
  } catch (error) {
    console.error("Error confirming process parameters:", error);
    return NextResponse.json(
      { error: "Failed to confirm process parameters" },
      { status: 500 }
    );
  }
}
