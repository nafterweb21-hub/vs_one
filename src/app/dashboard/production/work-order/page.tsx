import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function WorkOrdersPage() {
  const workOrders = await prisma.workOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Work Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your production work orders and track their progress
          </p>
        </div>
        <Link
          href="/dashboard/production/work-order/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Create Work Order
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {workOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700 mb-2">No work orders found</p>
            <p className="text-sm">Create your first work order to get started tracking production.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order No</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {workOrders.map((wo) => (
                  <tr key={wo.workOrderNo} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {wo.workOrderNo}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(wo.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {wo.customer.customerName}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {wo.jobDescription || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        wo.status === 'WIP' ? 'bg-amber-100 text-amber-700' :
                        wo.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {wo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/production/work-order/${wo.workOrderNo}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View
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
