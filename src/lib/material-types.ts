import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_material_types.json");

interface MockMaterialType {
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
    await prisma.materialType.count();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

function readMockData(): MockMaterialType[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    }
  } catch (error) {}
  return [];
}

function writeMockData(data: MockMaterialType[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock material types:", error);
  }
}

export async function getMaterialTypes() {
  if (await checkDb()) {
    try {
      // Prisma schema defines status as "Active", "Inactive", or "Void"
      return await prisma.materialType.findMany({
        orderBy: { type: "asc" },
      });
    } catch (error) {
      console.error("Failed to get material types from db:", error);
    }
  }
  return readMockData();
}

export async function createMaterialType(data: { type: string; remark?: string }) {
  if (await checkDb()) {
    try {
      return await prisma.materialType.create({
        data: {
          type: data.type,
          remark: data.remark || null,
        },
      });
    } catch (e: any) {
      throw new Error("Material type already exists or failed to create");
    }
  }

  const items = readMockData();
  if (items.some((i) => i.type.toLowerCase() === data.type.toLowerCase())) {
    throw new Error("Material type already exists");
  }

  const newItem: MockMaterialType = {
    id: "mt-" + Date.now().toString(),
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

export async function updateMaterialType(id: string, data: Partial<MockMaterialType>) {
  if (await checkDb()) {
    try {
      return await prisma.materialType.update({
        where: { id },
        data: {
          remark: data.remark !== undefined ? data.remark : undefined,
          status: data.status,
        },
      });
    } catch (e: any) {
      throw new Error("Failed to update material type in database");
    }
  }

  const items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Material type not found");

  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeMockData(items);
  return items[index];
}

export async function deleteMaterialType(id: string) {
  if (await checkDb()) {
    try {
      await prisma.materialType.delete({ where: { id } });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete material type in database");
    }
  }

  let items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Material type not found");

  items = items.filter((i) => i.id !== id);
  writeMockData(items);
  return true;
}
