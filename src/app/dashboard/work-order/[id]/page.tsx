"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  const fetchWorkOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/work-order/${id}`);
      if (res.ok) {
        const data = await res.json();
        setWorkOrder(data);
      } else {
        alert("Work Order not found");
        router.push("/dashboard/work-order");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-zinc-500">Loading Work Order details...</div>;
  }

  if (!workOrder) return null;

  const tabs = [
    { id: "details", label: "WO Details" },
    { id: "in-process", label: "In Process" },
    { id: "routing", label: "Routing Process" },
    { id: "timesheet", label: "Employee Timesheet" },
    { id: "parameters", label: "Parameters" },
    { id: "qc-ncr", label: "QC & NCR" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/work-order" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {workOrder.workOrderNo}
            </h2>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              workOrder.status === 'Draft' ? 'bg-zinc-50 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20' :
              workOrder.status === 'Proceed' ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30' :
              workOrder.status === 'WIP' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30' :
              workOrder.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30' :
              'bg-zinc-50 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20'
            }`}>
              {workOrder.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 pl-8">
            Customer: {workOrder.customerName} &bull; Job: {workOrder.jobDescription}
          </p>
        </div>
        
        <div className="flex gap-2">
          {workOrder.status === 'Draft' && (
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              Proceed to Planning
            </button>
          )}
          {workOrder.status === 'Proceed' && (
            <button className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 transition-colors">
              Start WIP
            </button>
          )}
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <nav className="-mb-px flex space-x-6 px-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        
        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">General Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-zinc-500">Date</div>
                <div className="font-medium">{workOrder.date ? new Date(workOrder.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</div>
                <div className="text-zinc-500">Delivery Date</div>
                <div className="font-medium">{workOrder.deliveryDate ? new Date(workOrder.deliveryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : '-'}</div>
                <div className="text-zinc-500">PO Ref</div>
                <div className="font-medium">{workOrder.customerPoRef || '-'}</div>
                <div className="text-zinc-500">Project Code</div>
                <div className="font-medium">{workOrder.projectCode || '-'}</div>
                <div className="text-zinc-500">Quantity</div>
                <div className="font-medium">{workOrder.quantity} {workOrder.uom}</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Additional</h3>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Remarks</label>
                <textarea 
                  className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700 dark:text-white" 
                  rows={4} 
                  defaultValue={workOrder.remark || ''}
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "in-process" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">In Process Blocks</h3>
              <button className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                + Add Block
              </button>
            </div>
            {workOrder.inProcessSteps?.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No in-process blocks defined yet.</p>
            ) : (
              <div className="space-y-4">
                {workOrder.inProcessSteps.map((step: any) => (
                  <div key={step.id} className="p-4 border rounded-lg dark:border-zinc-800">
                    SN {step.sn} - {step.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "routing" && (
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Routing Processes</h3>
            <p className="text-sm text-zinc-500 italic">Select an In-Process block to manage its internal routing steps.</p>
          </div>
        )}

        {activeTab === "timesheet" && (
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Employee Timesheets</h3>
            <p className="text-sm text-zinc-500 italic">No timesheets recorded yet.</p>
          </div>
        )}

        {activeTab === "parameters" && (
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Process Parameters</h3>
            <p className="text-sm text-zinc-500 italic">Select a routing process to view parameters.</p>
          </div>
        )}

        {activeTab === "qc-ncr" && (
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">QC & Non-Conformance</h3>
            <p className="text-sm text-zinc-500 italic">QC approvals will appear here after routing is completed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
