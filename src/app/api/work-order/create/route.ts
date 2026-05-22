import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { salesOrderItemId } = await req.json();

    if (!salesOrderItemId) {
      return NextResponse.json({ error: 'Sales Order Item ID is required' }, { status: 400 });
    }

    // Fetch the Sales Order Item and its related Sales Order
    const soItem = await prisma.salesOrderItem.findUnique({
      where: { id: salesOrderItemId },
      include: {
        workOrderRef: true,
        salesOrder: {
          include: {
            items: {
              orderBy: { createdAt: 'asc' } // To find the index
            },
            customer: true
          }
        },
        part: true,
        uom: true
      }
    });

    if (!soItem) {
      return NextResponse.json({ error: 'Sales Order Item not found' }, { status: 404 });
    }

    if (soItem.workOrderRef) {
      return NextResponse.json({ error: 'Work Order already exists for this batch' }, { status: 400 });
    }

    if (soItem.salesOrder.status !== 'Confirmed') {
      return NextResponse.json({ error: 'Cannot create Work Order for an unconfirmed Sales Order' }, { status: 400 });
    }

    // Determine A (Sequential Part Number index)
    const itemIndex = soItem.salesOrder.items.findIndex(item => item.id === soItem.id) + 1;
    // B (Batch Number) is 1 since we don't support splitting yet
    const batchNumber = 1;

    const workOrderNo = `${soItem.salesOrder.orderNo}-${itemIndex}-${batchNumber}`;

    // Create the Work Order
    const workOrder = await prisma.workOrder.create({
      data: {
        workOrderNo,
        salesOrderId: soItem.salesOrder.id,
        salesOrderItemId: soItem.id,
        customerName: soItem.salesOrder.customer.customerName,
        customerPoRef: soItem.salesOrder.customerPoRef || '',
        projectCode: soItem.salesOrder.projectCode || '',
        deliveryDate: soItem.deliveryDate,
        jobDescription: soItem.part.description,
        quantity: soItem.quantity,
        uom: soItem.uom.uomName,
        amount: 0, // Set to 0 since SO Item doesn't have an amount
        remark: soItem.remark,
        status: 'Draft',
      }
    });

    return NextResponse.json(workOrder);
  } catch (error: any) {
    console.error('Error creating Work Order:', error);
    return NextResponse.json({ error: 'Failed to create Work Order' }, { status: 500 });
  }
}
