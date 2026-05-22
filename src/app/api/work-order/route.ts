import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        salesOrder: {
          select: { orderNo: true }
        }
      }
    });

    return NextResponse.json(workOrders);
  } catch (error: any) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 });
  }
}
