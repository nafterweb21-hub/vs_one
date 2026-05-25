const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result1 = await prisma.purchaseOrder.updateMany({
    where: { status: "Pending Approval 1" },
    data: { status: "Pending For Approval" },
  });
  const result2 = await prisma.purchaseOrder.updateMany({
    where: { status: "Pending Approval 2" },
    data: { status: "Pending For Approval" },
  });
  console.log(`Updated ${result1.count + result2.count} POs to 'Pending For Approval'`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
