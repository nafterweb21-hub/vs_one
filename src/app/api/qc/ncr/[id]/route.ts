import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const ncr = await prisma.ncr.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        workOrder: {
          include: {
            customer: true,
            inProcesses: true,
          }
        },
        inProcess: {
          include: {
            routingProcesses: true
          }
        },
        mainProcess: true,
        routingProcess: true,
        requestor: true,
        responsibleParty: true,
        rootCauseResponsibleStaff: true,
        cpaResponsibleStaff: true,
        verifiedConfirmedBy: true,
        failureModes: {
          include: {
            failureMode: true
          }
        }
      },
    });

    if (!ncr) {
      return NextResponse.json({ error: "NCR not found" }, { status: 404 });
    }

    return NextResponse.json(ncr);
  } catch (error: any) {
    console.error("GET /api/qc/ncr/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch NCR" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const failureModeIds = body.failureModeIds;
    delete body.failureModeIds;

    const dataToUpdate: any = { ...body };

    if (failureModeIds !== undefined) {
      // First delete existing associations
      await prisma.ncrFailureMode.deleteMany({
        where: { ncrId: params.id }
      });

      // Then create new ones
      dataToUpdate.failureModes = {
        create: failureModeIds.map((id: string) => ({
          failureMode: { connect: { id } }
        }))
      };
    }

    const updatedNcr = await prisma.ncr.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: {
        failureModes: {
          include: { failureMode: true }
        }
      }
    });

    return NextResponse.json(updatedNcr);
  } catch (error: any) {
    console.error("PUT /api/qc/ncr/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update NCR" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.ncr.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/qc/ncr/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete NCR" }, { status: 500 });
  }
}
