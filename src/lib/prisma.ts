import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma_v6: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("DATABASE_URL is not set. Skipping PrismaClient initialization during build.");
    return new Proxy({} as any, {
      get() {
        return function () {
          throw new Error("DATABASE_URL is not set. PrismaClient was not initialized.");
        };
      },
    }) as PrismaClient;
  }
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma_v6 ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v6 = prisma;
}
