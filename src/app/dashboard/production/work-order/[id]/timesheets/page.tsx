import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function WorkOrderTimesheetsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  if (isNew) {
    notFound();
  }

  const dbWorkOrder = await prisma.workOrder.findUnique({
    where: { workOrderNo: id },
  });

  if (!dbWorkOrder) {
    notFound();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/production/work-order"
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Work Order: {dbWorkOrder.workOrderNo}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage work order details, routing, and parameters
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Sub-navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            href={`/dashboard/production/work-order/${id}`}
            className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 text-sm font-medium"
          >
            Order Details
          </Link>
          <Link
            href={`/dashboard/production/work-order/${id}/routing`}
            className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 text-sm font-medium"
          >
            In-Process & Routing
          </Link>
          <div className="border-b-2 border-blue-600 text-blue-600 whitespace-nowrap py-4 px-1 text-sm font-medium">
            Timesheets & Parameters
          </div>
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-800">Timesheets & Parameters</h3>
          <p className="text-slate-500 mt-2">This module is currently under development.</p>
        </div>
      </div>
    </div>
  );
}
