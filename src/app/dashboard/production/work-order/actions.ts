"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ──────────────────────────────────────────────────────────────────────────────
// Outstanding Work — SO batches that have a workOrderNo assigned but no WO row yet
// ──────────────────────────────────────────────────────────────────────────────
export async function getOutstandingWorkBatches() {
  const batches = await prisma.salesOrderItemBatch.findMany({
    where: {
      workOrderNo: { not: null },
      SalesOrderItem: { SalesOrder: { status: "Confirmed" } },
    },
    include: {
      SalesOrderItem: {
        include: {
          FinishedGoodProfile: { select: { partNo: true, description: true } },
          UomProfile: { select: { uomName: true } },
          SalesOrder: {
            include: { CustomerProfile: { select: { customerName: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const wos = await prisma.workOrder.findMany({
    where: { workOrderNo: { in: batches.map((b: any) => b.workOrderNo!).filter(Boolean) } },
    select: { workOrderNo: true },
  });
  const created = new Set(wos.map((w: any) => w.workOrderNo));

  return batches
    .filter((b: any) => b.workOrderNo && !created.has(b.workOrderNo))
    .map((b: any) => ({
      batchId: b.id,
      workOrderNo: b.workOrderNo!,
      salesOrderNo: b.SalesOrderItem.SalesOrder.orderNo,
      customer: b.SalesOrderItem.SalesOrder.CustomerProfile.customerName,
      partNo: b.SalesOrderItem.FinishedGoodProfile.partNo,
      jobDescription: b.SalesOrderItem.FinishedGoodProfile.description,
      quantity: b.quantity,
      uom: b.SalesOrderItem.UomProfile.uomName,
      deliveryDate: b.deliveryDate.toISOString(),
      noRoutingProcess: b.noRoutingProcess,
    }));
}

export async function createWorkOrderFromBatch(batchId: string) {
  try {
    const batch = await prisma.salesOrderItemBatch.findUnique({
      where: { id: batchId },
      include: {
        SalesOrderItem: {
          include: {
            FinishedGoodProfile: true,
            UomProfile: true,
            SalesOrder: {
              include: { CustomerProfile: true, SalesOrderItem: true },
            },
          },
        },
      },
    });

    if (!batch || !batch.workOrderNo) {
      return { success: false, error: "Batch has no Work Order No allocated" };
    }
    if (batch.SalesOrderItem.SalesOrder.status !== "Confirmed") {
      return { success: false, error: "Sales Order is not Confirmed" };
    }

    const existing = await prisma.workOrder.findUnique({
      where: { workOrderNo: batch.workOrderNo },
    });
    if (existing) {
      return { success: false, error: "Work Order already exists for this batch" };
    }

    const so = batch.SalesOrderItem.SalesOrder;
    const wo = await prisma.workOrder.create({
      data: {
        workOrderNo: batch.workOrderNo,
        date: new Date(),
        customerId: so.customerId,
        internalQuotationNo: batch.SalesOrderItem.internalQuotationNo,
        customerPoRef: so.customerPoRef,
        projectCode: so.projectCode,
        deliveryDate: batch.deliveryDate,
        jobDescription: batch.SalesOrderItem.FinishedGoodProfile.description,
        quantity: batch.quantity,
        uom: batch.SalesOrderItem.UomProfile.uomName,
        amount: Number(batch.SalesOrderItem.unitPrice) * batch.quantity,
        status: "Draft",
      },
    });

    revalidatePath("/dashboard/production/work-order");
    return { success: true, workOrderNo: wo.workOrderNo };
  } catch (err: any) {
    console.error("createWorkOrderFromBatch:", err);
    return { success: false, error: err.message || "Failed to create work order" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Editable header fields (Remark + Label fields + Upload)
// ──────────────────────────────────────────────────────────────────────────────
export async function updateWorkOrderEditable(
  workOrderNo: string,
  data: {
    date?: string;
    remark?: string;
    labelExpiryDate?: string | null;
    labelQty?: string | number | null;
    labelUomId?: string | null;
    uploadUrl?: string | null;
  },
) {
  try {
    // Date: forward OK, backdate not allowed.
    let date: Date | undefined;
    if (data.date) {
      const d = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) {
        return { success: false, error: "Backdating is not allowed" };
      }
      date = d;
    }

    await prisma.workOrder.update({
      where: { workOrderNo },
      data: {
        ...(date ? { date } : {}),
        remark: data.remark ?? null,
        labelExpiryDate: data.labelExpiryDate ? new Date(data.labelExpiryDate) : null,
        labelQty: data.labelQty != null && data.labelQty !== "" ? Number(data.labelQty) : null,
        labelUomId: data.labelUomId || null,
        uploadUrl: data.uploadUrl || null,
      },
    });

    revalidatePath(`/dashboard/production/work-order/${workOrderNo}`);
    return { success: true };
  } catch (err: any) {
    console.error("updateWorkOrderEditable:", err);
    return { success: false, error: err.message || "Failed to save" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Status state machine
// ──────────────────────────────────────────────────────────────────────────────
const ALLOWED: Record<string, string[]> = {
  Draft: ["Proceed", "Void"],
  Proceed: ["WIP", "Cancelled"],
  WIP: ["On Hold", "Pending for QC", "Cancelled"],
  "On Hold": ["WIP", "Cancelled"],
  "Pending for QC": ["Completed", "On Hold"],
  Completed: [],
  Void: [],
  Cancelled: [],
};

export async function transitionWorkOrderStatus(workOrderNo: string, next: string) {
  try {
    const wo = await prisma.workOrder.findUnique({
      where: { workOrderNo },
      include: {
        inProcesses: { include: { routingProcesses: true } },
      },
    });
    if (!wo) return { success: false, error: "Work order not found" };

    const allowed = ALLOWED[wo.status] ?? [];
    if (!allowed.includes(next)) {
      return { success: false, error: `Cannot move from ${wo.status} to ${next}` };
    }

    // Proceed requires at least one routing process planned
    if (next === "Proceed") {
      const hasRouting = wo.inProcesses.some((ip: any) => ip.routingProcesses.length > 0);
      if (!hasRouting) {
        return { success: false, error: "Set at least one routing process before Proceed" };
      }
    }

    await prisma.workOrder.update({ where: { workOrderNo }, data: { status: next } });
    revalidatePath(`/dashboard/production/work-order/${workOrderNo}`);
    revalidatePath("/dashboard/production/work-order");
    return { success: true };
  } catch (err: any) {
    console.error("transitionWorkOrderStatus:", err);
    return { success: false, error: err.message || "Failed to transition status" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// In-Process CRUD
// ──────────────────────────────────────────────────────────────────────────────
export async function addInProcess(data: {
  workOrderNo: string;
  description: string;
  conditionalSnId?: string | null;
  allFlag?: boolean;
  targetCompletionDate: string;
  remark?: string;
  uploadUrl?: string;
}) {
  try {
    const wo = await prisma.workOrder.findUnique({
      where: { workOrderNo: data.workOrderNo },
      include: { inProcesses: true },
    });
    if (!wo) return { success: false, error: "Work order not found" };

    if (["Completed", "Void", "Cancelled"].includes(wo.status)) {
      return { success: false, error: `Cannot edit in-process on ${wo.status} work order` };
    }

    const last = await prisma.workOrderInProcess.findFirst({
      where: { workOrderNo: data.workOrderNo },
      orderBy: { sn: "desc" },
    });
    const sn = (last?.sn ?? 0) + 1;

    const created = await prisma.workOrderInProcess.create({
      data: {
        workOrderNo: data.workOrderNo,
        sn,
        description: data.description,
        conditionalSnId: data.conditionalSnId || null,
        allFlag: !!data.allFlag,
        targetCompletionDate: new Date(data.targetCompletionDate),
        remark: data.remark || null,
        uploadUrl: data.uploadUrl || null,
        status: "New",
      },
    });

    revalidatePath(`/dashboard/production/work-order/${data.workOrderNo}/routing`);
    return { success: true, id: created.id };
  } catch (err: any) {
    console.error("addInProcess:", err);
    return { success: false, error: err.message || "Failed to add in-process" };
  }
}

export async function updateInProcess(
  id: string,
  data: {
    description?: string;
    conditionalSnId?: string | null;
    allFlag?: boolean;
    targetCompletionDate?: string;
    remark?: string | null;
    uploadUrl?: string | null;
  },
) {
  try {
    const ip = await prisma.workOrderInProcess.findUnique({
      where: { id },
      include: { workOrder: true },
    });
    if (!ip) return { success: false, error: "In-process not found" };

    await prisma.workOrderInProcess.update({
      where: { id },
      data: {
        ...(data.description ? { description: data.description } : {}),
        conditionalSnId: data.conditionalSnId || null,
        ...(data.allFlag != null ? { allFlag: !!data.allFlag } : {}),
        ...(data.targetCompletionDate ? { targetCompletionDate: new Date(data.targetCompletionDate) } : {}),
        remark: data.remark ?? null,
        uploadUrl: data.uploadUrl ?? null,
      },
    });

    revalidatePath(`/dashboard/production/work-order/${ip.workOrderNo}/routing`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Routing Process CRUD
// ──────────────────────────────────────────────────────────────────────────────
export async function addRoutingProcess(data: {
  inProcessId: string;
  mainProcessId: string;
  routingProcessId: string;
  targetCompletionDate: string;
  remark?: string;
  uploadUrl?: string;
}) {
  try {
    const ip = await prisma.workOrderInProcess.findUnique({
      where: { id: data.inProcessId },
      include: { routingProcesses: true, workOrder: true },
    });
    if (!ip) return { success: false, error: "In-process not found" };
    if (["Completed", "Void", "Cancelled"].includes(ip.workOrder.status)) {
      return { success: false, error: `Cannot edit routing on ${ip.workOrder.status} work order` };
    }

    // Spec: new routing process can only be appended after existing Completed / WIP rows.
    // SN is auto-assigned as max(numericSn) + 1.
    const numericSns = ip.routingProcesses
      .map((r: any) => parseInt(r.sn, 10))
      .filter((n: number) => Number.isFinite(n));
    const nextSn = (numericSns.length ? Math.max(...numericSns) : 0) + 1;

    const created = await prisma.routingProcess.create({
      data: {
        inProcessId: data.inProcessId,
        sn: String(nextSn),
        mainProcessId: data.mainProcessId,
        routingProcessId: data.routingProcessId,
        targetCompletionDate: new Date(data.targetCompletionDate),
        remark: data.remark || null,
        uploadUrl: data.uploadUrl || null,
        status: "New",
      },
    });

    revalidatePath(`/dashboard/production/work-order/${ip.workOrderNo}/routing`);
    return { success: true, id: created.id };
  } catch (err: any) {
    console.error("addRoutingProcess:", err);
    return { success: false, error: err.message || "Failed to add routing process" };
  }
}

export async function updateRoutingProcessTarget(id: string, targetCompletionDate: string, remark?: string | null) {
  try {
    const rp = await prisma.routingProcess.update({
      where: { id },
      data: {
        targetCompletionDate: new Date(targetCompletionDate),
        ...(remark !== undefined ? { remark: remark || null } : {}),
      },
      include: { inProcess: true },
    });
    revalidatePath(`/dashboard/production/work-order/${rp.inProcess.workOrderNo}/routing`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update" };
  }
}

export async function markRoutingProcessStatus(id: string, status: "New" | "WIP" | "Completed") {
  try {
    const rp = await prisma.routingProcess.findUnique({
      where: { id },
      include: { inProcess: { include: { workOrder: true, routingProcesses: { orderBy: { sn: "asc" } } } } },
    });
    if (!rp) return { success: false, error: "Routing process not found" };

    // Within an in-process, processes must run in sequence.
    if (status !== "New") {
      const all = rp.inProcess.routingProcesses.sort(
        (a: any, b: any) => parseInt(a.sn, 10) - parseInt(b.sn, 10),
      );
      const myIdx = all.findIndex((r: any) => r.id === id);
      const priorIncomplete = all.slice(0, myIdx).find((r: any) => r.status !== "Completed");
      if (priorIncomplete) {
        return {
          success: false,
          error: `Previous step (SN ${priorIncomplete.sn}) must complete first`,
        };
      }
    }

    await prisma.routingProcess.update({ where: { id }, data: { status } });

    // Roll WO status if newly WIP
    const wo = rp.inProcess.workOrder;
    if (status === "WIP" && (wo.status === "Proceed" || wo.status === "Draft")) {
      await prisma.workOrder.update({ where: { workOrderNo: wo.workOrderNo }, data: { status: "WIP" } });
    }

    revalidatePath(`/dashboard/production/work-order/${wo.workOrderNo}/routing`);
    revalidatePath(`/dashboard/production/work-order/${wo.workOrderNo}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update status" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Timesheet
// ──────────────────────────────────────────────────────────────────────────────
export async function upsertTimesheet(data: {
  id?: string;
  workOrderNo: string;
  routingProcessId: string;
  employeeId: string;
  timeIn?: string;
  timeOut?: string;
  completed: boolean;
  completedQty?: string;
  machineCodes?: string;
}) {
  try {
    let totalMinutes: number | null = null;
    if (data.timeIn && data.timeOut) {
      const ms = new Date(data.timeOut).getTime() - new Date(data.timeIn).getTime();
      if (ms > 0) totalMinutes = Number((ms / 60000).toFixed(2));
    }

    const payload = {
      routingProcessId: data.routingProcessId,
      employeeId: data.employeeId,
      timeIn: data.timeIn ? new Date(data.timeIn) : null,
      timeOut: data.timeOut ? new Date(data.timeOut) : null,
      totalMinutes,
      completed: data.completed,
      completedQty: data.completedQty ? Number(data.completedQty) : null,
      machineCodes: data.machineCodes || null,
    };

    if (data.id) {
      await prisma.productionTimesheet.update({ where: { id: data.id }, data: payload });
    } else {
      await prisma.productionTimesheet.create({ data: payload });
    }

    revalidatePath(`/dashboard/production/work-order/${data.workOrderNo}/timesheets`);
    return { success: true };
  } catch (err: any) {
    console.error("upsertTimesheet:", err);
    return { success: false, error: err.message || "Failed to save timesheet" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Reads used by detail pages
// ──────────────────────────────────────────────────────────────────────────────
export async function getRoutingDropdownData() {
  const [mainProcesses, processProfiles] = await Promise.all([
    prisma.mainProcess.findMany({
      where: { status: "Active" },
      select: { id: true, process: true },
      orderBy: { process: "asc" },
    }),
    prisma.processProfile.findMany({
      where: { status: "Active" },
      select: {
        id: true,
        routingProcess: true,
        mainProcessId: true,
        welding: true,
        sprayPainting: true,
        machining: true,
      },
      orderBy: { routingProcess: "asc" },
    }),
  ]);
  return { mainProcesses, processProfiles };
}

export async function getUomList() {
  return prisma.uomProfile.findMany({
    where: { status: "Active" },
    select: { id: true, uomName: true },
    orderBy: { uomName: "asc" },
  });
}
