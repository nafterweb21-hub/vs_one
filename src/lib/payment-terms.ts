import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_payment_terms.json");

export interface MockPaymentTerm {
  id: string;
  name: string; // Term
  days: number; // Day
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
    await prisma.paymentTermProfile.count();
    isDatabaseReady = true;
  } catch (error) {
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

function readMockData(): MockPaymentTerm[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    }
  } catch (error) {}
  return [];
}

function writeMockData(data: MockPaymentTerm[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write mock payment terms:", error);
  }
}

export async function getPaymentTerms() {
  if (await checkDb()) {
    try {
      const data = await prisma.paymentTermProfile.findMany({
        orderBy: { createdAt: "desc" },
      });
      return data.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));
    } catch {}
  }
  return readMockData();
}

export async function createPaymentTerm(data: { name: string; days: number; remark?: string }) {
  if (await checkDb()) {
    try {
      const existing = await prisma.paymentTermProfile.findFirst({
        where: { name: data.name }
      });
      if (existing) throw new Error("Payment Term already exists");

      const newItem = await prisma.paymentTermProfile.create({
        data: {
          name: data.name,
          days: data.days,
          remark: data.remark || null,
        },
      });
      return {
        ...newItem,
        createdAt: newItem.createdAt.toISOString(),
        updatedAt: newItem.updatedAt.toISOString(),
      };
    } catch (e: any) {
      if (e.message === "Payment Term already exists") throw e;
      throw new Error("Failed to create payment term profile");
    }
  }

  const items = readMockData();
  if (items.some((i) => i.name.toLowerCase() === data.name.toLowerCase())) {
    throw new Error("Payment Term already exists");
  }

  const newItem: MockPaymentTerm = {
    id: "pt-" + Date.now().toString(),
    name: data.name,
    days: data.days,
    remark: data.remark || null,
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeMockData(items);
  return newItem;
}

export async function updatePaymentTerm(id: string, data: Partial<MockPaymentTerm>) {
  if (await checkDb()) {
    try {
      const updatedItem = await prisma.paymentTermProfile.update({
        where: { id },
        data: {
          days: data.days !== undefined ? data.days : undefined,
          remark: data.remark !== undefined ? data.remark : undefined,
          status: data.status,
        },
      });
      return {
        ...updatedItem,
        createdAt: updatedItem.createdAt.toISOString(),
        updatedAt: updatedItem.updatedAt.toISOString(),
      };
    } catch (e: any) {
      throw new Error("Failed to update payment term profile in database");
    }
  }

  const items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Payment term profile not found");

  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeMockData(items);
  return items[index];
}

export async function deletePaymentTerm(id: string) {
  if (await checkDb()) {
    try {
      await prisma.paymentTermProfile.delete({ where: { id } });
      return true;
    } catch (e: any) {
      throw new Error("Failed to delete payment term profile in database");
    }
  }

  let items = readMockData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Payment term profile not found");

  items = items.filter((i) => i.id !== id);
  writeMockData(items);
  return true;
}
