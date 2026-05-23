import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_joint_profiles.json");

export interface MockJointProfile {
  id: string;
  joint: string;
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
    await prisma.jointProfile.count();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

function readMockData(): MockJointProfile[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    }
  } catch (error) {}
  return [];
}

function writeMockData(data: MockJointProfile[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock joint profiles:", error);
  }
}

export async function getJointProfiles() {
  if (await checkDb()) {
    try {
      const data = await prisma.jointProfile.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      });
      // Convert Date to string for consistency with mock data and components
      return data.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));
    } catch {}
  }
  return readMockData().filter(item => !item.isDeleted);
}

export async function createJointProfile(data: { joint: string; remark?: string; createdBy?: string }) {
  if (await checkDb()) {
    try {
      const existing = await prisma.jointProfile.findFirst({
        where: { joint: data.joint, isDeleted: false }
      });
      if (existing) throw new Error("Joint already exists");

      const newItem = await prisma.jointProfile.create({
        data: {
          joint: data.joint,
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
      if (e.message === "Joint already exists") throw e;
      throw new Error("Failed to create joint profile");
    }
  }

  const items = readMockData();
  if (items.some((i) => i.joint.toLowerCase() === data.joint.toLowerCase() && !i.isDeleted)) {
    throw new Error("Joint already exists");
  }

  const newItem: MockJointProfile = {
    id: "jp-" + Date.now().toString(),
    joint: data.joint,
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

export async function updateJointProfile(id: string, data: Partial<MockJointProfile>) {
  if (await checkDb()) {
    try {
      const updatedItem = await prisma.jointProfile.update({
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
      throw new Error("Failed to update joint profile in database");
    }
  }

  const items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Joint profile not found");

  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeMockData(items);
  return items[index];
}

export async function deleteJointProfile(id: string, updatedBy?: string) {
  if (await checkDb()) {
    try {
      // Soft delete
      await prisma.jointProfile.update({ 
        where: { id },
        data: { 
          isDeleted: true,
          updatedBy: updatedBy || undefined
        }
      });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete joint profile in database");
    }
  }

  let items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Joint profile not found");

  items[index].isDeleted = true;
  if (updatedBy) items[index].updatedBy = updatedBy;
  items[index].updatedAt = new Date().toISOString();
  
  writeMockData(items);
  return true;
}
