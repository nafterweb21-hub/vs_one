import "dotenv/config";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

let prismaInstance: any;

const hasDatabaseUrl = !!process.env.DATABASE_URL;

if (hasDatabaseUrl) {
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
  } else {
    try {
      // Dynamic import to bypass Webpack's heavy static compilation of the generated client
      // if not strictly needed, avoiding SWC compiler limits on Windows WASM.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require("@/generated/prisma/client");
      const dbUrl = process.env.DATABASE_URL || "";
      if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
        const pg = require("pg");
        const { PrismaPg } = require("@prisma/adapter-pg");
        const pool = new pg.Pool({ connectionString: dbUrl });
        const adapter = new PrismaPg(pool);
        prismaInstance = new PrismaClient({ adapter });
        console.log("Prisma client initialized with PostgreSQL adapter.");
      } else {
        // Default to SQLite
        const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
        const dbPath = path.resolve(process.cwd(), "dev.db");
        const adapter = new PrismaBetterSqlite3({ url: dbPath });
        prismaInstance = new PrismaClient({ adapter });
        console.log("Prisma client initialized with SQLite adapter.");
      }

      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prismaInstance;
      }
    } catch (error) {
      console.warn("Failed to load real Prisma Client:", error);
    }
  }
}

// If database is not configured or loading failed, export a mock proxy that throws
// descriptive errors. Our library wrappers (like employees.ts) will catch these
// and automatically fall back to high-fidelity JSON storage.
if (!prismaInstance) {
  prismaInstance = new Proxy({} as Record<string, unknown>, {
    get(target, prop) {
      // Handle thenable / Promise checks
      if (prop === "then") return undefined;
      
      return new Proxy({} as Record<string, unknown>, {
        get(t, method) {
          return async () => {
            throw new Error(
              `Database operation "${String(prop)}.${String(method)}" failed because DATABASE_URL is not configured in .env.`
            );
          };
        }
      });
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma = prismaInstance as any;
