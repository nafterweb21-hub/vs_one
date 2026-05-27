import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const res = await prisma.finishedGoodProfile.findMany();
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

main();
