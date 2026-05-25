import { prisma } from "../src/lib/prisma";

async function run() {
  try {
    const users = await prisma.user.findMany();
    console.log("USERS:", users.map(u => ({ id: u.id, email: u.email, hasHash: !!u.passwordHash, isActive: u.isActive })));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

run();
