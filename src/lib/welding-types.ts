import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_welding_types.json");

interface MockWeldingType {
  id: string;
  type: string;
  remark: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

let isDatabaseReady = false;
let hasCheckedDatabase = false;

async function checkDb() {
  if (hasCheckedDatabase) return isDatabaseReady;
  try {
    await prisma.weldingTypeProfile.count();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

function readMockData(): MockWeldingType[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    }
  } catch (error) {}
  return [];
}

function writeMockData(data: MockWeldingType[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock welding types:", error);
  }
}

export async function getWeldingTypes() {
  if (await checkDb()) {
    try {
      return await prisma.weldingTypeProfile.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {}
  }
  return readMockData();
}

export async function createWeldingType(data: { type: string; remark?: string }) {
  if (await checkDb()) {
    try {
      return await prisma.weldingTypeProfile.create({
        data: {
          type: data.type,
          remark: data.remark || null,
        },
      });
    } catch (e: any) {
      throw new Error("Welding type already exists or failed to create");
    }
  }

  const items = readMockData();
  if (items.some((i) => i.type.toLowerCase() === data.type.toLowerCase())) {
    throw new Error("Welding type already exists");
  }

  const newItem: MockWeldingType = {
    id: "wt-" + Date.now().toString(),
    type: data.type,
    remark: data.remark || null,
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeMockData(items);
  return newItem;
}

export async function updateWeldingType(id: string, data: Partial<MockWeldingType>) {
  if (await checkDb()) {
    try {
      return await prisma.weldingTypeProfile.update({
        where: { id },
        data: {
          remark: data.remark !== undefined ? data.remark : undefined,
          status: data.status,
        },
      });
    } catch (e: any) {
      throw new Error("Failed to update welding type in database");
    }
  }

  const items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Welding type not found");

  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeMockData(items);
  return items[index];
}

export async function deleteWeldingType(id: string) {
  if (await checkDb()) {
    try {
      await prisma.weldingTypeProfile.delete({ where: { id } });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete welding type in database");
    }
  }

  let items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Welding type not found");

  items = items.filter((i) => i.id !== id);
  writeMockData(items);
  return true;
}
