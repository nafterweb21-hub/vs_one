
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@/generated/prisma/client";


// Global store to persist mock data across fast refreshes
const globalForPrisma = globalThis as unknown as {

  prisma: any;
  mockDb: any;
  useMock: boolean;
};

// Initialize global mock database if it doesn't exist
if (!globalForPrisma.mockDb) {
  globalForPrisma.mockDb = {
    company: [
      {
        id: "mock-company-1",
        name: "Vision One Global Solutions",
        address: "123 Innovation Way, Suite 400, Tech Park",
        phoneNo: "+1-555-0199",
        faxNo: "+1-555-0198",
        email: "operations@visionone.io",
        website: "https://visionone.io",
        rocNo: "ROC20261109A",
        gstRegistrationNo: "GST-99281726-01",
        uploadUrl: "/uploads",
        logoUrl: null,
        footerUrl: null,
        logoName: "logo.png",
        footerName: "footer.png",
        allowCreatePoForWo: true,
        as9100RequirementNote: true,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-company-2",
        name: "Nafterweb Logistics",
        address: "456 Enterprise Boulevard, Logistics Hub",
        phoneNo: "+1-555-0244",
        faxNo: "+1-555-0245",
        email: "support@nafterweb.com",
        website: "https://nafterweb.com",
        rocNo: "ROC20250912B",
        gstRegistrationNo: "GST-88172635-02",
        uploadUrl: "/uploads",
        logoUrl: null,
        footerUrl: null,
        logoName: "logo_alt.png",
        footerName: "footer_alt.png",
        allowCreatePoForWo: false,
        as9100RequirementNote: false,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    user: [],
    account: [],
    session: [],
    verificationToken: [],
    joint: [
      {
        id: "mock-joint-1",
        joint: "Spot Weld",
        remark: "Once saved, cannot be changed. E.g. Spot Weld",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-joint-2",
        joint: "Single-V Butt Joint",
        remark: "Bevel 30 deg",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-joint-3",
        joint: "Double Fillet Joint",
        remark: "None (Flat Face)",
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    paymentTerm: [
      {
        id: "mock-payment-term-1",
        term: "COD",
        day: 0,
        remark: "Cash on Delivery",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-payment-term-2",
        term: "Net 15",
        day: 15,
        remark: "Payment due in 15 days",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-payment-term-3",
        term: "Net 30",
        day: 30,
        remark: "Standard 30 day term",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-payment-term-4",
        term: "Net 60",
        day: 60,
        remark: "Extended 60 day term",
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  };
} else if (globalForPrisma.mockDb.paymentTerm.length === 0) {
  // Force seed if empty in memory
  globalForPrisma.mockDb.paymentTerm = [
    {
      id: "mock-payment-term-1",
      term: "COD",
      day: 0,
      remark: "Cash on Delivery",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-payment-term-2",
      term: "Net 15",
      day: 15,
      remark: "Payment due in 15 days",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-payment-term-3",
      term: "Net 30",
      day: 30,
      remark: "Standard 30 day term",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-payment-term-4",
      term: "Net 60",
      day: 60,
      remark: "Extended 60 day term",
      status: "Inactive",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
}

if (globalForPrisma.mockDb && !globalForPrisma.mockDb.joint) {
  globalForPrisma.mockDb.joint = [];
}
if (globalForPrisma.mockDb && globalForPrisma.mockDb.joint.length === 0) {
  globalForPrisma.mockDb.joint = [
      {
        id: "mock-joint-1",
        joint: "Spot Weld",
        remark: "Once saved, cannot be changed. E.g. Spot Weld",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-joint-2",
        joint: "Single-V Butt Joint",
        remark: "Bevel 30 deg",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mock-joint-3",
        joint: "Double Fillet Joint",
        remark: "None (Flat Face)",
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ];
}

// Simple in-memory runner for Prisma queries
function runMockQuery(model: string, operation: string, args: any) {
  if (!globalForPrisma.mockDb[model]) {
    globalForPrisma.mockDb[model] = [];
  }
  const store = globalForPrisma.mockDb[model];

  console.log(`[Prisma Mock] ${model}.${operation} called with:`, JSON.stringify(args, null, 2));

  switch (operation) {
    case "findMany": {
      const results = [...store];

      // Handle simple sorting by criteria if provided
      if (args?.orderBy) {
        const orderKey = Object.keys(args.orderBy)[0];
        const orderDir = args.orderBy[orderKey];
        results.sort((a, b) => {
          const valA = a[orderKey];
          const valB = b[orderKey];
          if (valA < valB) return orderDir === "asc" ? -1 : 1;
          if (valA > valB) return orderDir === "asc" ? 1 : -1;
          return 0;
        });
      }
      return results;
    }

    case "findUnique":
    case "findFirst": {
      const where = args?.where || {};
      return store.find((item: any) => {
        return Object.entries(where).every(([key, val]) => {
          if (val === undefined) return true;
          return item[key] === val;
        });
      }) || null;
    }

    case "create": {
      const data = args?.data || {};
      const newItem = {
        id: `${model.toLowerCase()}-${Math.random().toString(36).substring(2, 11)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      store.push(newItem);
      return newItem;
    }

    case "update": {
      const where = args?.where || {};
      const data = args?.data || {};
      const index = store.findIndex((item: any) => {
        return Object.entries(where).every(([key, val]) => {
          if (val === undefined) return true;
          return item[key] === val;
        });
      });
      if (index === -1) {
        throw new Error(`Record to update not found in mock store for ${model}`);
      }
      const updatedItem = {
        ...store[index],
        ...data,
        updatedAt: new Date(),
      };
      store[index] = updatedItem;
      return updatedItem;
    }

    case "delete": {
      const where = args?.where || {};
      const index = store.findIndex((item: any) => {
        return Object.entries(where).every(([key, val]) => {
          if (val === undefined) return true;
          return item[key] === val;
        });
      });
      if (index === -1) {
        throw new Error(`Record to delete not found in mock store for ${model}`);
      }
      const deletedItem = store.splice(index, 1)[0];
      return deletedItem;
    }

    default:
      throw new Error(`In-Memory Mock: Operation '${operation}' on model '${model}' is not supported.`);
  }
}

// Try instantiating client
let underlyingPrisma: any = null;
try {
  // If the database URL is placeholder, default to mock immediately to avoid warnings
  const isPlaceholderDb = process.env.DATABASE_URL?.includes("localhost:5432") || !process.env.DATABASE_URL;
  if (!isPlaceholderDb) {
    underlyingPrisma = new PrismaClient({} as any);
  } else {
    globalForPrisma.useMock = true;
    console.warn("[Prisma Info] Using In-Memory Mock Database automatically (placeholder DATABASE_URL detected).");
  }
} catch (e) {
  globalForPrisma.useMock = true;
  console.warn("[Prisma Warning] Failed to instantiate PrismaClient, using In-Memory Mock Database instead.", e);
}

// Proxy wrapper to intercept all db operations
export const prisma = new Proxy({} as any, {
  get(target, propKey) {
    const modelName = propKey as string;

    // Direct properties or methods on PrismaClient
    if (modelName === "$connect" || modelName === "$disconnect") {
      return async () => { };
    }

    return new Proxy({} as any, {
      get(modelTarget, operationKey) {
        const operation = operationKey as string;

        return async (args: any) => {
          // If we already know we're using mock
          if (globalForPrisma.useMock || !underlyingPrisma) {
            return runMockQuery(modelName, operation, args);
          }

          try {
            // Try the real Prisma call
            return await underlyingPrisma[modelName][operation](args);
          } catch (error: any) {
            // Check if error is database connectivity related
            const isConnectionError =
              error.message?.includes("Can't reach database") ||
              error.message?.includes("connect") ||
              error.message?.includes("Driver Adapter") ||
              error.code === "P1001" ||
              error.code === "P1002" ||
              error.code === "P1003" ||
              error.code === "P1008" ||
              error.code === "P1017";

            if (isConnectionError) {
              console.warn(`[Prisma Warning] Database query failed. Falling back to In-Memory Mock Database. Error: ${error.message}`);
              globalForPrisma.useMock = true;
              return runMockQuery(modelName, operation, args);
            }

            // Otherwise, throw original query/validation error
            throw error;
          }
        };
      }
    });
  }
});


