import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OutstandingWorkButton from "./components/OutstandingWorkButton";

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Proceed: "bg-blue-100 text-blue-700",
  WIP: "bg-amber-100 text-amber-700",
  "On Hold": "bg-orange-100 text-orange-700",
  "Pending for QC": "bg-purple-100 text-purple-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Void: "bg-rose-100 text-rose-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

export default async function WorkOrdersPage() {
  const workOrders = await prisma.workOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { CustomerProfile: true },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Work Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Work orders are created from confirmed Sales Order batches via Outstanding Work.
          </p>
        </div>
        <OutstandingWorkButton />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {workOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700 mb-2">No work orders yet</p>
            <p className="text-sm">
              Click <span className="font-medium">Outstanding Work</span> to pick a confirmed sales order batch.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Work Order No</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Job Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Qty</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {workOrders.map((wo: any) => (
                  <tr key={wo.workOrderNo} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-blue-600">{wo.workOrderNo}</td>
                    <td className="px-6 py-4">{new Date(wo.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{wo.CustomerProfile?.customerName}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{wo.jobDescription || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      {wo.quantity != null ? Number(wo.quantity).toString() : "-"} {wo.uom ?? ""}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          STATUS_STYLES[wo.status] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {wo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/production/work-order/${wo.workOrderNo}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Open
                      </Link>
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
