import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_MAT_FILE_PATH = path.join(process.cwd(), "src/lib/mock_materials.json");
const MOCK_CAT_FILE_PATH = path.join(process.cwd(), "src/lib/mock_categories.json");

interface MockMaterial {
  id: string;
  partNo: string | null;
  description: string;
  shape: string;
  size: string | null;
  categoryId: string;
  remark: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  category?: MockCategory;
}

interface MockCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

let isDatabaseReady = false;
let hasCheckedDatabase = false;

async function checkDb() {
  if (hasCheckedDatabase) return isDatabaseReady;
  try {
    await prisma.materialCategory.count();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

// ========================
// CATEGORIES
// ========================

function readMockCategories(): MockCategory[] {
  try {
    if (fs.existsSync(MOCK_CAT_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_CAT_FILE_PATH, "utf-8"));
    }
  } catch (error) { }
  return [];
}

function writeMockCategories(data: MockCategory[]) {
  try {
    fs.writeFileSync(MOCK_CAT_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock categories:", error);
  }
}

export async function getCategories() {
  if (await checkDb()) {
    try {
      return await prisma.materialCategory.findMany({
        orderBy: { name: "asc" },
      });
    } catch { }
  }
  return readMockCategories();
}

export async function createCategory(data: { name: string; description?: string | null }) {
  if (await checkDb()) {
    try {
      return await prisma.materialCategory.create({
        data: {
          name: data.name,
          description: data.description || null,
        },
      });
    } catch (e: any) {
      throw new Error("Category already exists or failed to create");
    }
  }

  const categories = readMockCategories();
  if (categories.some((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
    throw new Error("Category already exists");
  }

  const newCategory: MockCategory = {
    id: "cat-" + Date.now().toString(),
    name: data.name,
    description: data.description || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  writeMockCategories(categories);
  return newCategory;
}

// ========================
// MATERIALS
// ========================

function readMockMaterials(): MockMaterial[] {
  try {
    if (fs.existsSync(MOCK_MAT_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_MAT_FILE_PATH, "utf-8"));
    }
  } catch (error) { }
  return [];
}

function writeMockMaterials(data: MockMaterial[]) {
  try {
    fs.writeFileSync(MOCK_MAT_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock materials:", error);
  }
}

export async function getMaterials() {
  if (await checkDb()) {
    try {
      return await prisma.materialProfile.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
    } catch { }
  }

  const materials = readMockMaterials();
  const categories = readMockCategories();

  // populate relations
  return materials.map(mat => ({
    ...mat,
    category: categories.find(c => c.id === mat.categoryId) || null
  }));
}

export async function createMaterial(data: {
  partNo?: string;
  description: string;
  shape: string;
  size?: string;
  categoryId: string;
  remark?: string;
}) {
  if (await checkDb()) {
    try {
      return await prisma.materialProfile.create({
        data: {
          partNo: data.partNo || null,
          description: data.description,
          shape: data.shape,
          size: data.size || null,
          categoryId: data.categoryId,
          remark: data.remark || null,
        },
      });
    } catch (e: any) {
      throw new Error("Failed to create material in database");
    }
  }

  const materials = readMockMaterials();
  if (materials.some(m => m.description === data.description)) {
    throw new Error("Description already exists");
  }
  if (data.partNo && materials.some(m => m.partNo === data.partNo)) {
    throw new Error("Part No already exists");
  }

  const newMaterial: MockMaterial = {
    id: "mat-" + Date.now().toString(),
    partNo: data.partNo || null,
    description: data.description,
    shape: data.shape,
    size: data.size || null,
    categoryId: data.categoryId,
    remark: data.remark || null,
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  materials.push(newMaterial);
  writeMockMaterials(materials);
  return newMaterial;
}

export async function updateMaterial(id: string, data: Partial<MockMaterial>) {
  if (await checkDb()) {
    try {
      return await prisma.materialProfile.update({
        where: { id },
        data: {
          shape: data.shape,
          size: data.size || null,
          categoryId: data.categoryId,
          remark: data.remark || null,
          status: data.status,
        },
      });
    } catch (e: any) {
      throw new Error("Failed to update material in database");
    }
  }

  const materials = readMockMaterials();
  const index = materials.findIndex(m => m.id === id);
  if (index === -1) throw new Error("Material not found");

  materials[index] = { ...materials[index], ...data, updatedAt: new Date().toISOString() };
  writeMockMaterials(materials);
  return materials[index];
}

export async function deleteMaterial(id: string) {
  if (await checkDb()) {
    try {
      await prisma.materialProfile.delete({ where: { id } });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete material in database");
    }
  }

  let materials = readMockMaterials();
  const index = materials.findIndex(m => m.id === id);
  if (index === -1) throw new Error("Material not found");

  materials = materials.filter(m => m.id !== id);
  writeMockMaterials(materials);
  return true;
}
