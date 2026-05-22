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
  materialCategories?: Array<{
    id: string;
    category: string;
    remark: string | null;
    status: string;
  }>;
  materialTypes?: Array<{
    id: string;
    type: string;
    remark: string | null;
    status: string;
  }>;
  mainProcesses?: Array<{
    id: string;
    process: string;
    remark: string | null;
    status: string;
  }>;
  processProfiles?: Array<{
    id: string;
    mainProcessId: string;
    routingProcess: string;
    welding: boolean;
    sprayPainting: boolean;
    machining: boolean;
    costPerMinute: number;
    remark: string | null;
    status: string;
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
  ],
  materialCategories: [
    { id: "cat-1", category: "Raw Plates", remark: "Standard raw steel plates", status: "Active" },
    { id: "cat-2", category: "Welding Rods", remark: "Consumables for welding", status: "Active" }
  ],
  materialTypes: [
    { id: "mtype-1", type: "Stainless Steel", remark: "Common stainless steel material", status: "Active" },
    { id: "mtype-2", type: "Mild Steel", remark: "Standard mild steel", status: "Active" }
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
    const parsed = JSON.parse(dataStr);
    if (!parsed.materialCategories) {
      parsed.materialCategories = [];
    }
    if (!parsed.materialTypes) {
      parsed.materialTypes = [];
    }
    if (!parsed.mainProcesses) {
      parsed.mainProcesses = [];
    }
    if (!parsed.processProfiles) {
      parsed.processProfiles = [];
    }
    return parsed;
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
        return dbUsers.map((u: any) => ({
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
      return dbProfiles.map((p: any) => ({
        id: p.id,
        module: p.module,
        actionButton: p.actionButton,
        minRange: p.minRange ? Number(p.minRange) : null,
        maxRange: p.maxRange ? Number(p.maxRange) : null,
        status: p.status,
        approvers: p.approvers.map((a: any) => ({
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
  return store.approvalProfiles.map((p: any) => ({
    ...p,
    approvers: p.approvers.map((a: any) => {
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
        return await prisma.$transaction(async (tx: any) => {
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

export async function getMaterialCategories() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const dbCategories = await prisma.materialCategory.findMany({
        orderBy: { category: "asc" }
      });
      return dbCategories;
    } catch (e) {
      console.warn("Prisma material category query failed, falling back to local storage:", e);
    }
  }

  // Fallback
  const store = getFallbackStore();
  const cats = store.materialCategories || [];
  return [...cats].sort((a, b) => a.category.localeCompare(b.category));
}

export async function saveMaterialCategory(data: {
  id?: string;
  category: string;
  remark: string | null;
  status: string;
}) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      if (data.id) {
        // Update existing
        const existing = await prisma.materialCategory.findUnique({
          where: { id: data.id }
        });

        const updated = await prisma.materialCategory.update({
          where: { id: data.id },
          data: {
            remark: data.remark,
            status: data.status,
            // category remains immutable
            category: existing?.category || data.category
          }
        });
        return updated;
      } else {
        // Check duplicate category name
        const existing = await prisma.materialCategory.findUnique({
          where: { category: data.category }
        });
        if (existing) {
          throw new Error(`Category "${data.category}" already exists.`);
        }

        // Create new
        const created = await prisma.materialCategory.create({
          data: {
            category: data.category,
            remark: data.remark,
            status: data.status
          }
        });
        return created;
      }
    } catch (e: any) {
      console.warn("Prisma material category save failed, falling back to local storage:", e);
      if (e.message?.includes("already exists")) {
        throw e;
      }
    }
  }

  // Fallback implementation
  const store = getFallbackStore();
  if (!store.materialCategories) {
    store.materialCategories = [];
  }

  if (data.id) {
    // Edit existing
    const idx = store.materialCategories.findIndex(c => c.id === data.id);
    if (idx !== -1) {
      // category name is immutable, keep the existing one
      const existingCategory = store.materialCategories[idx].category;
      store.materialCategories[idx] = {
        id: data.id,
        category: existingCategory,
        remark: data.remark,
        status: data.status
      };
    } else {
      throw new Error(`Material category with ID "${data.id}" not found.`);
    }
  } else {
    // Create new
    // Check duplicate category name
    const exists = store.materialCategories.some(c => c.category.toLowerCase() === data.category.toLowerCase());
    if (exists) {
      throw new Error(`Category "${data.category}" already exists.`);
    }

    const newId = `cat-new-${Date.now()}`;
    store.materialCategories.push({
      id: newId,
      category: data.category,
      remark: data.remark,
      status: data.status
    });
  }

  saveFallbackStore(store);
  return { success: true };
}

export async function toggleMaterialCategoryStatus(id: string, status: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.materialCategory.update({
        where: { id },
        data: { status }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma toggle status failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.materialCategories) {
    store.materialCategories = [];
  }
  const idx = store.materialCategories.findIndex(c => c.id === id);
  if (idx !== -1) {
    store.materialCategories[idx].status = status;
    saveFallbackStore(store);
  }
  return { success: true };
}

export async function voidMaterialCategory(id: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      // Rule: No DELETE anywhere - Void only
      const updated = await prisma.materialCategory.update({
        where: { id },
        data: { status: "Void" }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma void failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.materialCategories) {
    store.materialCategories = [];
  }
  const idx = store.materialCategories.findIndex(c => c.id === id);
  if (idx !== -1) {
    store.materialCategories[idx].status = "Void";
    saveFallbackStore(store);
  }
  return { success: true };
}

// ═══════════════════════════════════════════════
// Material Type Profile CRUD
// ═══════════════════════════════════════════════

export async function getMaterialTypes() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const dbTypes = await prisma.materialType.findMany({
        orderBy: { type: "asc" }
      });
      return dbTypes;
    } catch (e) {
      console.warn("Prisma material type query failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  const types = store.materialTypes || [];
  return [...types].sort((a, b) => a.type.localeCompare(b.type));
}

export async function saveMaterialType(data: {
  id?: string;
  type: string;
  remark: string | null;
  status: string;
}) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      if (data.id) {
        const existing = await prisma.materialType.findUnique({
          where: { id: data.id }
        });

        const updated = await prisma.materialType.update({
          where: { id: data.id },
          data: {
            remark: data.remark,
            status: data.status,
            type: existing?.type || data.type
          }
        });
        return updated;
      } else {
        const existing = await prisma.materialType.findUnique({
          where: { type: data.type }
        });
        if (existing) {
          throw new Error(`Material Type "${data.type}" already exists.`);
        }

        const created = await prisma.materialType.create({
          data: {
            type: data.type,
            remark: data.remark,
            status: data.status
          }
        });
        return created;
      }
    } catch (e: any) {
      console.warn("Prisma material type save failed, falling back to local storage:", e);
      if (e.message?.includes("already exists")) {
        throw e;
      }
    }
  }

  const store = getFallbackStore();
  if (!store.materialTypes) {
    store.materialTypes = [];
  }

  if (data.id) {
    const idx = store.materialTypes.findIndex(t => t.id === data.id);
    if (idx !== -1) {
      const existingType = store.materialTypes[idx].type;
      store.materialTypes[idx] = {
        id: data.id,
        type: existingType,
        remark: data.remark,
        status: data.status
      };
    } else {
      throw new Error(`Material type with ID "${data.id}" not found.`);
    }
  } else {
    const exists = store.materialTypes.some(t => t.type.toLowerCase() === data.type.toLowerCase());
    if (exists) {
      throw new Error(`Material Type "${data.type}" already exists.`);
    }

    const newId = `mtype-new-${Date.now()}`;
    store.materialTypes.push({
      id: newId,
      type: data.type,
      remark: data.remark,
      status: data.status
    });
  }

  saveFallbackStore(store);
  return { success: true };
}

export async function toggleMaterialTypeStatus(id: string, status: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.materialType.update({
        where: { id },
        data: { status }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma toggle status failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.materialTypes) {
    store.materialTypes = [];
  }
  const idx = store.materialTypes.findIndex(t => t.id === id);
  if (idx !== -1) {
    store.materialTypes[idx].status = status;
    saveFallbackStore(store);
  }
  return { success: true };
}

export async function voidMaterialType(id: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.materialType.update({
        where: { id },
        data: { status: "Void" }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma void failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.materialTypes) {
    store.materialTypes = [];
  }
  const idx = store.materialTypes.findIndex(t => t.id === id);
  if (idx !== -1) {
    store.materialTypes[idx].status = "Void";
    saveFallbackStore(store);
  }
  return { success: true };
}

// ═══════════════════════════════════════════════
// Main Process Profile CRUD
// ═══════════════════════════════════════════════

export async function getMainProcesses() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const dbProcesses = await prisma.mainProcess.findMany({
        orderBy: { process: "asc" }
      });
      return dbProcesses;
    } catch (e) {
      console.warn("Prisma main process query failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  const processes = store.mainProcesses || [];
  return [...processes].sort((a, b) => a.process.localeCompare(b.process));
}

export async function saveMainProcess(data: {
  id?: string;
  process: string;
  remark: string | null;
  status: string;
}) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      if (data.id) {
        const existing = await prisma.mainProcess.findUnique({
          where: { id: data.id }
        });

        const updated = await prisma.mainProcess.update({
          where: { id: data.id },
          data: {
            remark: data.remark,
            status: data.status,
            process: existing?.process || data.process
          }
        });
        return updated;
      } else {
        const existing = await prisma.mainProcess.findUnique({
          where: { process: data.process }
        });
        if (existing) {
          throw new Error(`Main Process "${data.process}" already exists.`);
        }

        const created = await prisma.mainProcess.create({
          data: {
            process: data.process,
            remark: data.remark,
            status: data.status
          }
        });
        return created;
      }
    } catch (e: any) {
      console.warn("Prisma main process save failed, falling back to local storage:", e);
      if (e.message?.includes("already exists")) {
        throw e;
      }
    }
  }

  const store = getFallbackStore();
  if (!store.mainProcesses) {
    store.mainProcesses = [];
  }

  if (data.id) {
    const idx = store.mainProcesses.findIndex((t: any) => t.id === data.id);
    if (idx !== -1) {
      const existingProcess = store.mainProcesses[idx].process;
      store.mainProcesses[idx] = {
        id: data.id,
        process: existingProcess,
        remark: data.remark,
        status: data.status
      };
    } else {
      throw new Error(`Main Process with ID "${data.id}" not found.`);
    }
  } else {
    const exists = store.mainProcesses.some((t: any) => t.process.toLowerCase() === data.process.toLowerCase());
    if (exists) {
      throw new Error(`Main Process "${data.process}" already exists.`);
    }

    const newId = `mprocess-new-${Date.now()}`;
    store.mainProcesses.push({
      id: newId,
      process: data.process,
      remark: data.remark,
      status: data.status
    });
  }

  saveFallbackStore(store);
  return { success: true };
}

export async function toggleMainProcessStatus(id: string, status: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.mainProcess.update({
        where: { id },
        data: { status }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma toggle status failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.mainProcesses) {
    store.mainProcesses = [];
  }
  const idx = store.mainProcesses.findIndex((t: any) => t.id === id);
  if (idx !== -1) {
    store.mainProcesses[idx].status = status;
    saveFallbackStore(store);
  }
  return { success: true };
}

export async function voidMainProcess(id: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.mainProcess.update({
        where: { id },
        data: { status: "Void" }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma void failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.mainProcesses) {
    store.mainProcesses = [];
  }
  const idx = store.mainProcesses.findIndex((t: any) => t.id === id);
  if (idx !== -1) {
    store.mainProcesses[idx].status = "Void";
    saveFallbackStore(store);
  }
  return { success: true };
}

// ═══════════════════════════════════════════════
// Process Profile CRUD
// ═══════════════════════════════════════════════

export async function getProcessProfiles() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const dbProfiles = await prisma.processProfile.findMany({
        include: {
          mainProcess: true
        },
        orderBy: { routingProcess: "asc" }
      });
      return dbProfiles.map((p: any) => ({
        ...p,
        costPerMinute: Number(p.costPerMinute)
      }));
    } catch (e) {
      console.warn("Prisma process profile query failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  const profiles = store.processProfiles || [];
  const mainProcesses = store.mainProcesses || [];

  return profiles.map((p: any) => {
    const mainProcess = mainProcesses.find(m => m.id === p.mainProcessId);
    return {
      ...p,
      mainProcess: mainProcess || { id: p.mainProcessId, process: "Unknown", status: "Active" }
    };
  }).sort((a, b) => a.routingProcess.localeCompare(b.routingProcess));
}

export async function saveProcessProfile(data: {
  id?: string;
  mainProcessId: string;
  routingProcess: string;
  welding: boolean;
  sprayPainting: boolean;
  machining: boolean;
  costPerMinute: number;
  remark: string | null;
  status: string;
}) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      if (data.id) {
        const updated = await prisma.processProfile.update({
          where: { id: data.id },
          data: {
            mainProcessId: data.mainProcessId,
            welding: data.welding,
            sprayPainting: data.sprayPainting,
            machining: data.machining,
            costPerMinute: data.costPerMinute,
            remark: data.remark,
            status: data.status,
            // routingProcess is immutable
          }
        });
        return updated;
      } else {
        const existing = await prisma.processProfile.findUnique({
          where: { routingProcess: data.routingProcess }
        });
        if (existing) {
          throw new Error(`Routing Process "${data.routingProcess}" already exists.`);
        }

        const created = await prisma.processProfile.create({
          data: {
            mainProcessId: data.mainProcessId,
            routingProcess: data.routingProcess,
            welding: data.welding,
            sprayPainting: data.sprayPainting,
            machining: data.machining,
            costPerMinute: data.costPerMinute,
            remark: data.remark,
            status: data.status
          }
        });
        return created;
      }
    } catch (e: any) {
      console.warn("Prisma process profile save failed, falling back to local storage:", e);
      if (e.message?.includes("already exists")) {
        throw e;
      }
    }
  }

  const store = getFallbackStore();
  if (!store.processProfiles) {
    store.processProfiles = [];
  }

  if (data.id) {
    const idx = store.processProfiles.findIndex(p => p.id === data.id);
    if (idx !== -1) {
      const existingRoutingProcess = store.processProfiles[idx].routingProcess;
      store.processProfiles[idx] = {
        id: data.id,
        mainProcessId: data.mainProcessId,
        routingProcess: existingRoutingProcess,
        welding: data.welding,
        sprayPainting: data.sprayPainting,
        machining: data.machining,
        costPerMinute: data.costPerMinute,
        remark: data.remark,
        status: data.status
      };
    } else {
      throw new Error(`Process Profile with ID "${data.id}" not found.`);
    }
  } else {
    const exists = store.processProfiles.some(p => p.routingProcess.toLowerCase() === data.routingProcess.toLowerCase());
    if (exists) {
      throw new Error(`Routing Process "${data.routingProcess}" already exists.`);
    }

    const newId = `process-${Date.now()}`;
    store.processProfiles.push({
      id: newId,
      mainProcessId: data.mainProcessId,
      routingProcess: data.routingProcess,
      welding: data.welding,
      sprayPainting: data.sprayPainting,
      machining: data.machining,
      costPerMinute: data.costPerMinute,
      remark: data.remark,
      status: data.status
    });
  }

  saveFallbackStore(store);
  return { success: true };
}

export async function toggleProcessProfileStatus(id: string, status: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.processProfile.update({
        where: { id },
        data: { status }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma toggle status failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.processProfiles) {
    store.processProfiles = [];
  }
  const idx = store.processProfiles.findIndex(p => p.id === id);
  if (idx !== -1) {
    store.processProfiles[idx].status = status;
    saveFallbackStore(store);
  }
  return { success: true };
}

export async function voidProcessProfile(id: string) {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    try {
      const updated = await prisma.processProfile.update({
        where: { id },
        data: { status: "Void" }
      });
      return updated;
    } catch (e) {
      console.warn("Prisma void failed, falling back to local storage:", e);
    }
  }

  const store = getFallbackStore();
  if (!store.processProfiles) {
    store.processProfiles = [];
  }
  const idx = store.processProfiles.findIndex(p => p.id === id);
  if (idx !== -1) {
    store.processProfiles[idx].status = "Void";
    saveFallbackStore(store);
  }
  return { success: true };
}
