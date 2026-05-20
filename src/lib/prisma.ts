import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

let prismaInstance: any;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const dbUrl = process.env.DATABASE_URL || "";
  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    try {
      const pg = require("pg");
      const { PrismaPg } = require("@prisma/adapter-pg");
      const pool = new pg.Pool({ connectionString: dbUrl });
      const adapter = new PrismaPg(pool);
      prismaInstance = new PrismaClient({ adapter });
      console.log("Prisma client initialized with PostgreSQL adapter.");
    } catch (e) {
      console.error("Failed to initialize Prisma client with PostgreSQL adapter:", e);
      throw e;
    }
  } else {
    // Default to SQLite
    try {
      const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
      const dbPath = path.resolve(process.cwd(), "dev.db");
      const adapter = new PrismaBetterSqlite3({ url: dbPath });
      prismaInstance = new PrismaClient({ adapter });
      console.log("Prisma client initialized with SQLite adapter.");
    } catch (e) {
      console.error("Failed to initialize Prisma client with SQLite adapter:", e);
      throw e;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
