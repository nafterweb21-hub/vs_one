import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddTimesheetModal from "../../components/AddTimesheetModal";
import ParameterDetailDrawer from "../../components/ParameterDetailDrawer";

export default async function WorkOrderTimesheetsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: { workOrderNo: id },
    include: {
      inProcesses: {
        orderBy: { sn: "asc" },
        include: {
          routingProcesses: {
            orderBy: { sn: "asc" },
            include: {
              mainProcess: true,
              routingProcess: true,
              productionTimesheets: {
                orderBy: { createdAt: "asc" },
                include: {
                  employee: true,
                  weldingParameter: {
                    include: {
                      weldingMachine: true,
                      typeOfJoint: true,
                      materialTypes: true,
                      weldingTypes: true,
                      confirmedBy: true,
                    },
                  },
                  sprayParameter: {
                    include: {
                      elcometer: true,
                      confirmedBy: true,
                    },
                  },
                  machiningParameter: {
                    include: {
                      machine: true,
                      toolLists: true,
                      confirmedBy: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!workOrder) notFound();

  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, code: true },
    orderBy: { name: "asc" },
  });

  const rows = workOrder.inProcesses.flatMap((ip: any) =>
    ip.routingProcesses.flatMap((rp: any) =>
      rp.productionTimesheets.map((ts: any) => ({
        ...ts,
        inProcessDescription: `${ip.sn}. ${ip.description}`,
        processName: rp.routingProcess?.routingProcess || rp.mainProcess?.process || "Unknown",
      })),
    ),
  );

  const routingProcesses = workOrder.inProcesses.flatMap((ip: any) =>
    ip.routingProcesses.map((rp: any) => ({
      id: rp.id,
      name: rp.routingProcess?.routingProcess || rp.mainProcess?.process || "Unknown",
      description: ip.description,
    })),
  );

  const editable = !["Void", "Cancelled", "Completed"].includes(workOrder.status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/production/work-order"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Work Order: {workOrder.workOrderNo}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Status: <span className="font-medium">{workOrder.status}</span>
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            href={`/dashboard/production/work-order/${id}`}
            className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 py-4 px-1 text-sm font-medium"
          >
            Order Details
          </Link>
          <Link
            href={`/dashboard/production/work-order/${id}/routing`}
            className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 py-4 px-1 text-sm font-medium"
          >
            In-Process & Routing
          </Link>
          <div className="border-b-2 border-blue-600 text-blue-600 py-4 px-1 text-sm font-medium">
            Timesheets & Parameters
          </div>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Production Timesheets</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scan IN / OUT data from Production Terminal. Authorized override only.
            </p>
          </div>
          {editable && (
            <AddTimesheetModal
              workOrderNo={id}
              employees={employees}
              routingProcesses={routingProcesses}
            />
          )}
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm">No timesheets recorded for this work order yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Process</th>
                  <th className="px-4 py-3 font-semibold">Time In</th>
                  <th className="px-4 py-3 font-semibold">Time Out</th>
                  <th className="px-4 py-3 font-semibold text-right">Total Min</th>
                  <th className="px-4 py-3 font-semibold text-center">Completed</th>
                  <th className="px-4 py-3 font-semibold text-right">Qty</th>
                  <th className="px-4 py-3 font-semibold">Machine</th>
                  <th className="px-4 py-3 font-semibold text-center">Parameters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((ts: any) => (
                  <tr key={ts.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{ts.employee.name}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700">{ts.processName}</div>
                      <div className="text-xs text-slate-500">{ts.inProcessDescription}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {ts.timeIn ? new Date(ts.timeIn).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {ts.timeOut ? new Date(ts.timeOut).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {ts.totalMinutes ? Number(ts.totalMinutes).toString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          ts.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {ts.completed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ts.completedQty ? Number(ts.completedQty).toString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{ts.machineCodes || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <ParameterDetailDrawer
                        welding={ts.weldingParameter ? JSON.parse(JSON.stringify(ts.weldingParameter)) : null}
                        spray={ts.sprayParameter ? JSON.parse(JSON.stringify(ts.sprayParameter)) : null}
                        machining={ts.machiningParameter ? JSON.parse(JSON.stringify(ts.machiningParameter)) : null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
