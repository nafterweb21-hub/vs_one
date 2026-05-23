import {
  getProcessProfiles as getFallbackProcessProfiles,
  saveProcessProfile,
  toggleProcessProfileStatus as toggleFallbackStatus,
  voidProcessProfile,
  getMainProcesses as getFallbackMainProcesses,
} from "./db-fallback";

export async function getProcessProfiles() {
  return await getFallbackProcessProfiles();
}

export async function getProcessProfileById(id: string) {
  const all = await getFallbackProcessProfiles();
  return all.find((p: any) => p.id === id) || null;
}

export async function createProcessProfile(data: {
  mainProcessId: string;
  routingProcess: string;
  welding: boolean;
  sprayPainting: boolean;
  machining: boolean;
  costPerMinute: number;
  remark?: string;
}) {
  return await saveProcessProfile({
    ...data,
    remark: data.remark || null,
    status: "Active",
  });
}

export async function updateProcessProfile(
  id: string,
  data: {
    welding: boolean;
    sprayPainting: boolean;
    machining: boolean;
    costPerMinute: number;
    remark?: string;
    status?: string;
    mainProcessId?: string;
    routingProcess?: string;
  }
) {
  const existing = await getProcessProfileById(id);
  if (!existing) throw new Error("Not found");

  return await saveProcessProfile({
    id,
    mainProcessId: data.mainProcessId || existing.mainProcessId,
    routingProcess: data.routingProcess || existing.routingProcess,
    welding: data.welding,
    sprayPainting: data.sprayPainting,
    machining: data.machining,
    costPerMinute: data.costPerMinute,
    remark: data.remark !== undefined ? data.remark : existing.remark,
    status: data.status || existing.status,
  });
}

export async function toggleProcessProfileStatus(id: string, status: string) {
  return await toggleFallbackStatus(id, status);
}

export async function deleteProcessProfile(id: string) {
  // Use void instead of delete per business rules in fallback
  return await voidProcessProfile(id);
}

export async function getMainProcesses() {
  const all = await getFallbackMainProcesses();
  return all.filter((m: any) => m.status === "Active");
}

