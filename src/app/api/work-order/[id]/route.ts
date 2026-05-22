import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        inProcessSteps: {
          include: {
            routingProcesses: {
              include: {
                mainProcess: true,
                routingProcess: true,
                employee: true,
                timesheets: true,
                weldingParams: true,
                paintingParams: true,
                machiningParams: true
              }
            }
          }
        },
        qcApprovals: true,
        ncrReports: true,
      }
    });

    if (!workOrder) {
      return NextResponse.json({ error: 'Work Order not found' }, { status: 404 });
    }

    return NextResponse.json(workOrder);
  } catch (error: any) {
    console.error('Error fetching work order:', error);
    return NextResponse.json({ error: 'Failed to fetch work order' }, { status: 500 });
  }
}
