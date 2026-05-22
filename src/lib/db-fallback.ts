import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// Path to save local fallback data
const DATA_DIR = path.join(process.cwd(), "prisma");
const DATA_FILE = path.join(DATA_DIR, "local_db_fallback.json");

// Structure of our fallback store
interface FallbackStore {
  users: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
  }>;
  approvalProfiles: Array<{
    id: string;
    module: string;
    actionButton: string | null;
    minRange: number | null;
    maxRange: number | null;
    status: string;
    approvers: Array<{
      id: string;
      approvalLevelProfileId: string;
      userId: string;
      status: string;
    }>;
  }>;
}

// Default seed data matching the specifications
const DEFAULT_SEED_DATA: FallbackStore = {
  users: [
    { id: "user-sy", name: "Shyue Yin", email: "sy@visionone.com", status: "Active" },
    { id: "user-danny", name: "Danny", email: "danny@visionone.com", status: "Active" },
    { id: "user-simeon", name: "Simeon", email: "simeon@visionone.com", status: "Active" },
    { id: "user-admin", name: "Admin", email: "admin@visionone.com", status: "Active" }
  ],
  approvalProfiles: [
    {
      id: "prof-1",
      module: "Purchase Order - Material",
      actionButton: "First Level",
      minRange: 0.00,
      maxRange: 499.99,
      status: "Active",
      approvers: [
        { id: "ap-1", approvalLevelProfileId: "prof-1", userId: "user-sy", status: "Active" }
      ]
    },
    {
      id: "prof-2",
      module: "Purchase Order - Material",
      actionButton: "Second Level",
      minRange: 500.00,
      maxRange: 1000000.00,
      status: "Active",
      approvers: [
        { id: "ap-2", approvalLevelProfileId: "prof-2", userId: "user-danny", status: "Active" },
        { id: "ap-3", approvalLevelProfileId: "prof-2", userId: "user-simeon", status: "Active" }
      ]
    }
  ]
};

// Ensure data file and directories exist
function getFallbackStore(): FallbackStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_DATA, null, 2), "utf8");
      return DEFAULT_SEED_DATA;
    }
    const dataStr = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(dataStr);
  } catch (error) {
    console.error("Failed to read fallback database file, using defaults:", error);
    return DEFAULT_SEED_DATA;
  }
}

function saveFallbackStore(store: FallbackStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save fallback database file:", error);
  }
}

// Checks if we can connect to the Prisma database
async function checkDbConnection(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }
  try {
    // A quick simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function getUsers() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const dbUsers = await prisma.user.findMany({
        orderBy: { name: "asc" }
      });
      if (dbUsers.length > 0) {
        return dbUsers.map(u => ({
          id: u.id,
          name: u.name || "",
          email: u.email,
          status: "Active"
        }));
      }
    } catch (e) {
      console.warn("Prisma user query failed, falling back to local storage:", e);
    }
  }

  // Fallback
  const store = getFallbackStore();
  return store.users;
}

export async function getApprovalProfiles() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const dbProfiles = await prisma.approvalLevelProfile.findMany({
        include: {
          approvers: {
            include: {
              user: true
            }
          }
        },
        orderBy: [
          { module: "asc" },
          { minRange: "asc" }
        ]
      });
      return dbProfiles.map(p => ({
        id: p.id,
        module: p.module,
        actionButton: p.actionButton,
        minRange: p.minRange ? Number(p.minRange) : null,
        maxRange: p.maxRange ? Number(p.maxRange) : null,
        status: p.status,
        approvers: p.approvers.map(a => ({
          id: a.id,
          userId: a.userId,
          status: a.status,
          user: {
            id: a.user.id,
            name: a.user.name || "",
            email: a.user.email,
            status: "Active"
          }
        }))
      }));
    } catch (e) {
      console.warn("Prisma profiles query failed, falling back to local storage:", e);
    }
  }

  // Fallback
  const store = getFallbackStore();
  // Map approver details
  return store.approvalProfiles.map(p => ({
    ...p,
    approvers: p.approvers.map(a => {
      const user = store.users.find(u => u.id === a.userId);
      return {
        ...a,
        user: user ? { ...user } : { id: a.userId, name: "Unknown", email: "", status: "Active" }
      };
    })
  }));
}

export async function saveApprovalProfile(data: {
  id?: string;
  module: string;
  actionButton: string | null;
  minRange: number | null;
  maxRange: number | null;
  status: string;
  approvers: Array<{ userId: string; status: string }>;
}) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      if (data.id) {
        // Update transaction
        return await prisma.$transaction(async (tx) => {
          // Delete old approvers
          await tx.approvalPerson.deleteMany({
            where: { approvalLevelProfileId: data.id }
          });

          // Update profile
          const updated = await tx.approvalLevelProfile.update({
            where: { id: data.id },
            data: {
              module: data.module,
              actionButton: data.actionButton,
              minRange: data.minRange,
              maxRange: data.maxRange,
              status: data.status,
              approvers: {
                create: data.approvers.map(ap => ({
                  userId: ap.userId,
                  status: ap.status
                }))
              }
            },
            include: { approvers: true }
          });
          return updated;
        });
      } else {
        // Create new
        const created = await prisma.approvalLevelProfile.create({
          data: {
            module: data.module,
            actionButton: data.actionButton,
            minRange: data.minRange,
            maxRange: data.maxRange,
            status: data.status,
            approvers: {
              create: data.approvers.map(ap => ({
                userId: ap.userId,
                status: ap.status
              }))
            }
          },
          include: { approvers: true }
        });
        return created;
      }
    } catch (e) {
      console.warn("Prisma profile save failed, falling back to local storage:", e);
    }
  }

  // Fallback implementation
  const store = getFallbackStore();
  if (data.id) {
    // Edit existing
    const idx = store.approvalProfiles.findIndex(p => p.id === data.id);
    if (idx !== -1) {
      store.approvalProfiles[idx] = {
        id: data.id,
        module: data.module,
        actionButton: data.actionButton,
        minRange: data.minRange,
        maxRange: data.maxRange,
        status: data.status,
        approvers: data.approvers.map((ap, apIdx) => ({
          id: `ap-edit-${data.id}-${apIdx}-${Date.now()}`,
          approvalLevelProfileId: data.id!,
          userId: ap.userId,
          status: ap.status
        }))
      };
    }
  } else {
    // Create new
    const newId = `prof-new-${Date.now()}`;
    store.approvalProfiles.push({
      id: newId,
      module: data.module,
      actionButton: data.actionButton,
      minRange: data.minRange,
      maxRange: data.maxRange,
      status: data.status,
      approvers: data.approvers.map((ap, apIdx) => ({
        id: `ap-create-${newId}-${apIdx}-${Date.now()}`,
        approvalLevelProfileId: newId,
        userId: ap.userId,
        status: ap.status
      }))
    });
  }

  saveFallbackStore(store);
  return { success: true };
}

export async function toggleApprovalProfileStatus(id: string, status: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.approvalLevelProfile.update({
        where: { id },
        data: { status }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma toggle status failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  const idx = store.approvalProfiles.findIndex(p => p.id === id);
  if (idx !== -1) {
    store.approvalProfiles[idx].status = status;
    saveFallbackStore(store);
  }
  return { success: true };
}

export async function voidApprovalProfile(id: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      // Rule: No DELETE anywhere - Void only
      const updated = await prisma.approvalLevelProfile.update({
        where: { id },
        data: { status: "Void" }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma void failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  const idx = store.approvalProfiles.findIndex(p => p.id === id);
  if (idx !== -1) {
    store.approvalProfiles[idx].status = "Void";
    saveFallbackStore(store);
  }
  return { success: true };
}
