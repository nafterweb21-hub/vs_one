import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WorkOrderForm from "../components/WorkOrderForm";
import { fetchWorkOrderFormDependencies } from "../actions";

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  let workOrder = null;
  if (!isNew) {
    const dbWorkOrder = await prisma.workOrder.findUnique({
      where: { workOrderNo: id },
    });

    if (!dbWorkOrder) {
      notFound();
    }

    // Convert Prisma Decimal objects to numbers to pass to Client Component safely
    workOrder = {
      ...dbWorkOrder,
      quantity: dbWorkOrder.quantity ? dbWorkOrder.quantity.toNumber() : null,
      amount: dbWorkOrder.amount ? dbWorkOrder.amount.toNumber() : null,
      labelQty: dbWorkOrder.labelQty ? dbWorkOrder.labelQty.toNumber() : null,
    };
  }

  const dependencies = await fetchWorkOrderFormDependencies();

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
              {isNew ? "Create Work Order" : `Work Order: ${workOrder?.workOrderNo}`}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isNew ? "Enter the details for the new work order" : "Manage work order details, routing, and parameters"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Sub-navigation (Only active if editing) */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <div className="border-b-2 border-blue-600 text-blue-600 whitespace-nowrap py-4 px-1 text-sm font-medium">
            Order Details
          </div>
          {!isNew ? (
            <>
              <Link
                href={`/dashboard/production/work-order/${id}/routing`}
                className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 text-sm font-medium"
              >
                In-Process & Routing
              </Link>
              <Link
                href={`/dashboard/production/work-order/${id}/timesheets`}
                className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 text-sm font-medium"
              >
                Timesheets & Parameters
              </Link>
            </>
          ) : (
            <div className="border-b-2 border-transparent text-slate-400 whitespace-nowrap py-4 px-1 text-sm font-medium cursor-not-allowed" title="Save order to unlock">
              In-Process & Routing (Locked)
            </div>
          )}
        </nav>
      </div>

      {/* Form Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
        <WorkOrderForm initialData={workOrder} dependencies={dependencies} />
      </div>
    </div>
  );
}
