// Prisma Client Singleton with defensive fallback to prevent SWC WASM compilation crashes when database is not configured.
import "dotenv/config";

let prismaInstance: unknown;

const globalForPrisma = globalThis as unknown as {
  prisma: unknown | undefined;
};

// Check if a database URL is present
const hasDatabaseUrl = !!process.env.DATABASE_URL;

if (hasDatabaseUrl) {
  try {
    // Dynamic import to bypass Webpack's heavy static compilation of the generated client
    // if not strictly needed, avoiding SWC compiler limits on Windows WASM.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@/generated/prisma/client");
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    console.warn("Failed to load real Prisma Client:", error);
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
export type PrismaClient = unknown;
