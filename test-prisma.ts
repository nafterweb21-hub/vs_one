import { PrismaClient } from "./src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  try {
    const ncrs = await prisma.ncr.findMany({
      where: {},
      include: {
        customer: true,
        requestor: true,
        responsibleParty: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Success:", ncrs);
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
