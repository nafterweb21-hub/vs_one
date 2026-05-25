import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/index.js";

const url = process.env.DATABASE_URL;
console.log("URL:", url);

async function test() {
  try {
    const prisma = new PrismaClient({ log: ['error'] });
    console.log("Prisma client initialized successfully");
    await prisma.user.findFirst();
    console.log("Query executed successfully");
  } catch (e) {
    console.error(e);
  }
}
test();
