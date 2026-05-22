import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_painting_methods.json");

interface MockPaintingMethod {
  id: string;
  method: string;
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
    await prisma.paintingMethodProfile.count();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

function readMockData(): MockPaintingMethod[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    }
  } catch (error) {}
  return [];
}

function writeMockData(data: MockPaintingMethod[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock painting methods:", error);
  }
}

export async function getPaintingMethods() {
  if (await checkDb()) {
    try {
      return await prisma.paintingMethodProfile.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {}
  }
  return readMockData();
}

export async function createPaintingMethod(data: { method: string; remark?: string }) {
  if (await checkDb()) {
    try {
      return await prisma.paintingMethodProfile.create({
        data: {
          method: data.method,
          remark: data.remark || null,
        },
      });
    } catch (e: any) {
      throw new Error("Painting method already exists or failed to create");
    }
  }

  const items = readMockData();
  if (items.some((i) => i.method.toLowerCase() === data.method.toLowerCase())) {
    throw new Error("Painting method already exists");
  }

  const newItem: MockPaintingMethod = {
    id: "pm-" + Date.now().toString(),
    method: data.method,
    remark: data.remark || null,
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeMockData(items);
  return newItem;
}

export async function updatePaintingMethod(id: string, data: Partial<MockPaintingMethod>) {
  if (await checkDb()) {
    try {
      return await prisma.paintingMethodProfile.update({
        where: { id },
        data: {
          remark: data.remark !== undefined ? data.remark : undefined,
          status: data.status,
        },
      });
    } catch (e: any) {
      throw new Error("Failed to update painting method in database");
    }
  }

  const items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Painting method not found");

  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeMockData(items);
  return items[index];
}

export async function deletePaintingMethod(id: string) {
  if (await checkDb()) {
    try {
      await prisma.paintingMethodProfile.delete({ where: { id } });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete painting method in database");
    }
  }

  let items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Painting method not found");

  items = items.filter((i) => i.id !== id);
  writeMockData(items);
  return true;
}
