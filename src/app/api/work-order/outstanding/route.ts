import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const outstandingBatches = await prisma.salesOrderItem.findMany({
      where: {
        workOrderRef: null,
        salesOrder: {
          status: 'Confirmed'
        }
      },
      include: {
        salesOrder: {
          select: {
            orderNo: true,
            date: true,
            customer: {
              select: {
                customerName: true
              }
            }
          }
        },
        part: {
          select: {
            partNo: true,
            description: true
          }
        },
        uom: {
          select: {
            uomName: true
          }
        }
      }
    });

    return NextResponse.json(outstandingBatches);
  } catch (error: any) {
    console.error('Error fetching outstanding work orders:', error);
    return NextResponse.json({ error: 'Failed to fetch outstanding batches' }, { status: 500 });
  }
}
