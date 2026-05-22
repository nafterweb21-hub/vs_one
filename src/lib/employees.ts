import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "src/lib/mock_employees.json");

export interface Employee {
  id: string;
  code: string;
  name: string;
  nricFin: string;
  designation: string | null;
  email: string;
  mobileNo: string | null;
  gender: string | null;
  contactNo: string | null;
  employmentType: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Helper to read mock data from file
function readMockData(): Employee[] {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      const data = fs.readFileSync(MOCK_FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading mock employees file:", error);
  }
  return [];
}

// Helper to write mock data to file
function writeMockData(data: Employee[]) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing mock employees file:", error);
  }
}

// Check database connection by running a simple select/count
let isDatabaseReady = false;
let hasCheckedDatabase = false;

async function checkDatabaseConnection(): Promise<boolean> {
  if (hasCheckedDatabase) return isDatabaseReady;

  try {
    // Attempt a lightweight operation to check if the DB is connected
    await prisma.employee.count();
    isDatabaseReady = true;
    console.log("Prisma PostgreSQL connection successful!");
  } catch (error) {
    console.warn(
      "Prisma PostgreSQL connection failed. Falling back to local JSON storage for development.",
      error instanceof Error ? error.message : ""
    );
    isDatabaseReady = false;
  }
  hasCheckedDatabase = true;
  return isDatabaseReady;
}

export interface EmployeeInput {
  code: string;
  name: string;
  nricFin: string;
  designation?: string;
  email: string;
  mobileNo?: string;
  gender?: string;
  contactNo?: string;
  employmentType?: string;
  status?: string;
}

export async function getEmployees() {
  const useDb = await checkDatabaseConnection();
  if (useDb) {
    try {
      return await prisma.employee.findMany({
        orderBy: { code: "asc" },
      });
    } catch (e) {
      console.warn("Prisma getEmployees failed, falling back to mock:", e);
    }
  }
  return readMockData().sort((a, b) => a.code.localeCompare(b.code));
}

export async function getEmployeeById(id: string) {
  const useDb = await checkDatabaseConnection();
  if (useDb) {
    try {
      return await prisma.employee.findUnique({
        where: { id },
      });
    } catch (e) {
      console.warn("Prisma getEmployeeById failed, falling back to mock:", e);
    }
  }
  return readMockData().find((emp: any) => emp.id === id) || null;
}

export async function createEmployee(data: EmployeeInput) {
  // Validate unique fields (code and nricFin)
  const currentEmployees = await getEmployees();

  if (currentEmployees.some((emp: any) => emp.code.toLowerCase() === data.code.toLowerCase())) {
    throw new Error(`Employee Code "${data.code}" already exists.`);
  }
  if (currentEmployees.some((emp: any) => emp.nricFin.toLowerCase() === data.nricFin.toLowerCase())) {
    throw new Error(`NRIC / FIN "${data.nricFin}" already exists.`);
  }

  const useDb = await checkDatabaseConnection();
  if (useDb) {
    try {
      return await prisma.employee.create({
        data: {
          code: data.code,
          name: data.name,
          nricFin: data.nricFin,
          designation: data.designation || null,
          email: data.email,
          mobileNo: data.mobileNo || null,
          gender: data.gender || null,
          contactNo: data.contactNo || null,
          employmentType: data.employmentType || null,
          status: data.status || "ACTIVE",
        },
      });
    } catch (e) {
      console.warn("Prisma createEmployee failed, falling back to mock:", e);
    }
  }

  // Fallback storage
  const mockEmps = readMockData();
  const newEmp = {
    id: `emp-${Date.now()}`,
    code: data.code,
    name: data.name,
    nricFin: data.nricFin,
    designation: data.designation || "",
    email: data.email,
    mobileNo: data.mobileNo || "",
    gender: data.gender || "",
    contactNo: data.contactNo || "",
    employmentType: data.employmentType || "",
    status: data.status || "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockEmps.push(newEmp);
  writeMockData(mockEmps);
  return newEmp;
}

export async function updateEmployee(id: string, data: Partial<EmployeeInput>) {
  const currentEmployees = await getEmployees();
  const existing = currentEmployees.find((emp: any) => emp.id === id);
  if (!existing) {
    throw new Error("Employee not found");
  }

  // Validate employee name is immutable
  if (data.name !== undefined && data.name !== existing.name) {
    throw new Error("Employee Name is immutable and cannot be changed once saved.");
  }

  // Validate unique fields if changed
  if (data.code !== undefined && data.code.toLowerCase() !== existing.code.toLowerCase()) {
    if (currentEmployees.some((emp: any) => emp.code.toLowerCase() === data.code!.toLowerCase() && emp.id !== id)) {
      throw new Error(`Employee Code "${data.code}" already in use.`);
    }
  }
  if (data.nricFin !== undefined && data.nricFin.toLowerCase() !== existing.nricFin.toLowerCase()) {
    if (currentEmployees.some((emp: any) => emp.nricFin.toLowerCase() === data.nricFin!.toLowerCase() && emp.id !== id)) {
      throw new Error(`NRIC / FIN "${data.nricFin}" already in use.`);
    }
  }

  const useDb = await checkDatabaseConnection();
  if (useDb) {
    try {
      return await prisma.employee.update({
        where: { id },
        data: {
          code: data.code,
          designation: data.designation,
          email: data.email,
          mobileNo: data.mobileNo,
          gender: data.gender,
          contactNo: data.contactNo,
          employmentType: data.employmentType,
          status: data.status,
        },
      });
    } catch (e) {
      console.warn("Prisma updateEmployee failed, falling back to mock:", e);
    }
  }

  // Fallback storage
  const mockEmps = readMockData();
  const index = mockEmps.findIndex((emp) => emp.id === id);
  if (index !== -1) {
    const updated = {
      ...mockEmps[index],
      ...data,
      name: mockEmps[index].name, // strictly preserve immutable name
      updatedAt: new Date().toISOString(),
    };
    mockEmps[index] = updated;
    writeMockData(mockEmps);
    return updated;
  }
  throw new Error("Employee not found");
}

export async function deleteEmployee(id: string) {
  const useDb = await checkDatabaseConnection();
  if (useDb) {
    try {
      return await prisma.employee.delete({
        where: { id },
      });
    } catch (e) {
      console.warn("Prisma deleteEmployee failed, falling back to mock:", e);
    }
  }

  // Fallback storage
  const mockEmps = readMockData();
  const index = mockEmps.findIndex((emp) => emp.id === id);
  if (index !== -1) {
    const deleted = mockEmps[index];
    mockEmps.splice(index, 1);
    writeMockData(mockEmps);
    return deleted;
  }
  throw new Error("Employee not found");
}
