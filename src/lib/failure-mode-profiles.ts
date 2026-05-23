import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_failure_mode_profiles.json");

export interface MockFailureModeProfile {
  id: string;
  failureMode: string;
  remark: string | null;
  status: string;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

let isDatabaseReady = false;
let hasCheckedDatabase = false;

async function checkDb() {
  if (hasCheckedDatabase) return isDatabaseReady;
  try {
    // @ts-ignore - Ignore type error if Prisma client hasn't been generated yet
    if (prisma.failureModeProfile) {
      // @ts-ignore
      await prisma.failureModeProfile.count();
      isDatabaseReady = true;
    }
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

function readMockData(): MockFailureModeProfile[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    }
  } catch (error) {}
  return [];
}

function writeMockData(data: MockFailureModeProfile[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock failure mode profiles:", error);
  }
}

export async function getFailureModeProfiles() {
  if (await checkDb()) {
    try {
      // @ts-ignore
      const data = await prisma.failureModeProfile.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      });
      // Convert Date to string for consistency with mock data and components
      return data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));
    } catch {}
  }
  return readMockData().filter(item => !item.isDeleted);
}

export async function createFailureModeProfile(data: { failureMode: string; remark?: string; createdBy?: string }) {
  if (await checkDb()) {
    try {
      // @ts-ignore
      const existing = await prisma.failureModeProfile.findFirst({
        where: { failureMode: data.failureMode, isDeleted: false }
      });
      if (existing) throw new Error("Failure Mode already exists");

      // @ts-ignore
      const newItem = await prisma.failureModeProfile.create({
        data: {
          failureMode: data.failureMode,
          remark: data.remark || null,
          createdBy: data.createdBy || null,
          updatedBy: data.createdBy || null,
        },
      });
      return {
        ...newItem,
        createdAt: newItem.createdAt.toISOString(),
        updatedAt: newItem.updatedAt.toISOString(),
      };
    } catch (e: any) {
      if (e.message === "Failure Mode already exists") throw e;
      throw new Error("Failed to create failure mode profile");
    }
  }

  const items = readMockData();
  if (items.some((i) => i.failureMode.toLowerCase() === data.failureMode.toLowerCase() && !i.isDeleted)) {
    throw new Error("Failure Mode already exists");
  }

  const newItem: MockFailureModeProfile = {
    id: "fmp-" + Date.now().toString(),
    failureMode: data.failureMode,
    remark: data.remark || null,
    status: "Active",
    isDeleted: false,
    createdBy: data.createdBy || null,
    updatedBy: data.createdBy || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeMockData(items);
  return newItem;
}

export async function updateFailureModeProfile(id: string, data: Partial<MockFailureModeProfile>) {
  if (await checkDb()) {
    try {
      // @ts-ignore
      const updatedItem = await prisma.failureModeProfile.update({
        where: { id },
        data: {
          remark: data.remark !== undefined ? data.remark : undefined,
          status: data.status,
          updatedBy: data.updatedBy !== undefined ? data.updatedBy : undefined,
        },
      });
      return {
        ...updatedItem,
        createdAt: updatedItem.createdAt.toISOString(),
        updatedAt: updatedItem.updatedAt.toISOString(),
      };
    } catch (e: any) {
      throw new Error("Failed to update failure mode profile in database");
    }
  }

  const items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Failure Mode profile not found");

  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeMockData(items);
  return items[index];
}

export async function deleteFailureModeProfile(id: string, updatedBy?: string) {
  if (await checkDb()) {
    try {
      // Soft delete
      // @ts-ignore
      await prisma.failureModeProfile.update({ 
        where: { id },
        data: { 
          isDeleted: true,
          updatedBy: updatedBy || undefined
        }
      });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete failure mode profile in database");
    }
  }

  let items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Failure Mode profile not found");

  items[index].isDeleted = true;
  if (updatedBy) items[index].updatedBy = updatedBy;
  items[index].updatedAt = new Date().toISOString();
  
  writeMockData(items);
  return true;
}
