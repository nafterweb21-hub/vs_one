const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.purchaseOrder.updateMany({
    where: { status: "Pending For Approval" },
    data: { status: "Pending Approval 1" },
  });
  console.log(`Updated ${result.count} POs to 'Pending Approval 1'`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
