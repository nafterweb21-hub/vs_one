import { prisma } from './src/lib/prisma';

async function main() {
  const batches = await prisma.salesOrderItemBatch.findMany({
    include: { SalesOrderItem: { include: { SalesOrder: true } } }
  });
  console.log("Total Batches:", batches.length);
  batches.forEach(b => {
    console.log(`- Batch ID: ${b.id}, WO No: ${b.workOrderNo}, SO Status: ${b.SalesOrderItem.SalesOrder.status}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
