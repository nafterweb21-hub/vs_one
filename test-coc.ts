import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const cocs = await prisma.certificateOfConformity.findMany({
      include: {
        customer: true,
        deliveryOrder: true,
        workOrder: true,
        checkedBy: true,
        approvedBy: true,
      }
    });
    console.log(cocs);
  } catch (err) {
    console.error(err);
  }
}
main();
