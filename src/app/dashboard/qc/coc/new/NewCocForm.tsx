"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNewCoc } from "../actions";

export default function NewCocForm({
  customers,
  deliveryOrders,
  workOrders,
  employees,
  machines,
  uoms,
  routingProcesses,
  cocTypes,
}: any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [customerId, setCustomerId] = useState("");
  const [deliveryOrderId, setDeliveryOrderId] = useState("");
  const [workOrderNo, setWorkOrderNo] = useState("");
  const [cocTypeId, setCocTypeId] = useState("");

  const selectedType = useMemo(() => {
    return cocTypes?.find((c: any) => c.id === cocTypeId)?.type || "";
  }, [cocTypeId, cocTypes]);

  const filteredDOs = useMemo(() => {
    if (!customerId) return [];
    return deliveryOrders.filter((d: any) => d.customerId === customerId);
  }, [customerId, deliveryOrders]);

  const filteredWOs = useMemo(() => {
    if (!customerId) return [];
    // Just showing all WOs for that customer for now. Ideally DO would link to WOs.
    return workOrders.filter((w: any) => w.customerId === customerId);
  }, [customerId, workOrders]);

  const selectedWO = useMemo(() => {
    return workOrders.find((w: any) => w.workOrderNo === workOrderNo);
  }, [workOrderNo, workOrders]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {
      date: new Date(formData.get("date") as string).toISOString(),
      cocTypeId: formData.get("cocTypeId"),
      customerId: formData.get("customerId"),
      deliveryOrderId: formData.get("deliveryOrderId"),
      workOrderNo: formData.get("workOrderNo"),
      routingProcessId: formData.get("routingProcessId") || null,
      drawingNo: formData.get("drawingNo") || null,
      description: formData.get("description") || null,
      customerRefNo: formData.get("customerRefNo") || null,
      woQuantity: formData.get("woQuantity") ? parseFloat(formData.get("woQuantity") as string) : null,
      doQuantity: formData.get("doQuantity") ? parseFloat(formData.get("doQuantity") as string) : null,
      woUomId: formData.get("woUomId") || null,
      doUomId: formData.get("doUomId") || null,
      cocQuantity: formData.get("cocQuantity") ? parseFloat(formData.get("cocQuantity") as string) : null,
      cocUomId: formData.get("cocUomId") || null,
      status: "Draft",
    };

    if (selectedType === "Welding") {
      data.sanNo = formData.get("sanNo");
      data.welderId = formData.get("welderId");
      data.weldingProcess = formData.get("weldingProcess");
      data.weldingMachineId = formData.get("weldingMachineId");
    } else if (selectedType === "Spray Paint") {
      data.partName = formData.get("partName");
      data.partNumber = formData.get("partNumber");
      data.paintingSanNo = formData.get("paintingSanNo");
      data.painterId = formData.get("painterId");
      data.paintingMethod = formData.get("paintingMethod");
      data.paintingSpecification = formData.get("paintingSpecification");
      data.paintThicknessSpecification = formData.get("paintThicknessSpecification");
      data.measuredTotalPaintThickness = formData.get("measuredTotalPaintThickness");
      data.paintBatchNo = formData.get("paintBatchNo");
      data.inspectionEquipment = formData.get("inspectionEquipment");
    }

    const res = await createNewCoc(data);

    if (res.success) {
      router.push("/dashboard/qc/coc");
    } else {
      setErrorMsg(res.error || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full bg-blue-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-900">
            Create Certificate of Conformity
          </h1>
          <p className="text-sm text-blue-500 mt-1">
            Fill in the details to generate a new COC.
          </p>
        </div>
        <Link
          href="/dashboard/qc/coc"
          className="text-sm font-semibold text-cyan-600 hover:text-cyan-500 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-rose-500 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-rose-800">Error</h3>
                <p className="text-sm text-rose-600 mt-1">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">Date <span className="text-rose-500">*</span></label>
              <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">Customer <span className="text-rose-500">*</span></label>
              <select name="customerId" required value={customerId} onChange={(e) => { setCustomerId(e.target.value); setDeliveryOrderId(""); setWorkOrderNo(""); }} className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">Select Customer...</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">Delivery Order <span className="text-rose-500">*</span></label>
              <select name="deliveryOrderId" required value={deliveryOrderId} onChange={(e) => setDeliveryOrderId(e.target.value)} disabled={!customerId} className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50">
                <option value="">Select DO...</option>
                {filteredDOs.map((d: any) => <option key={d.id} value={d.id}>{d.doNo}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">Work Order <span className="text-rose-500">*</span></label>
              <select name="workOrderNo" required value={workOrderNo} onChange={(e) => setWorkOrderNo(e.target.value)} disabled={!customerId} className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50">
                <option value="">Select WO...</option>
                {filteredWOs.map((w: any) => <option key={w.workOrderNo} value={w.workOrderNo}>{w.workOrderNo}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">COC Type <span className="text-rose-500">*</span></label>
              <select name="cocTypeId" required value={cocTypeId} onChange={(e) => setCocTypeId(e.target.value)} className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">Select Type...</option>
                {cocTypes?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">Routing Process</label>
              <select name="routingProcessId" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">N/A</option>
                {routingProcesses.map((r: any) => <option key={r.id} value={r.id}>{r.ProcessProfile?.routingProcess || r.sn}</option>)}
              </select>
            </div>
          </div>

          <hr className="border-blue-100" />

          {selectedWO && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-1.5">WO Quantity</label>
                <input type="number" name="woQuantity" readOnly value={selectedWO.quantity || ''} className="w-full rounded-lg border border-blue-200 bg-gray-100 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-1.5">Description</label>
                <input type="text" name="description" readOnly value={selectedWO.jobDescription || ''} className="w-full rounded-lg border border-blue-200 bg-gray-100 px-4 py-2 text-sm" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-blue-900 mb-1.5">COC Quantity</label>
                <input type="number" step="0.01" name="cocQuantity" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-1.5">Drawing No</label>
                <input type="text" name="drawingNo" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
          </div>

          {selectedType === "Welding" && (
            <>
              <h2 className="text-lg font-bold text-blue-900 mt-6 border-b border-blue-100 pb-2">Welding Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">SAN No</label>
                  <input type="text" name="sanNo" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Welder</label>
                  <select name="welderId" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm">
                    <option value="">Select Welder...</option>
                    {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Welding Process</label>
                  <input type="text" name="weldingProcess" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Welding Machine</label>
                  <select name="weldingMachineId" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm">
                    <option value="">Select Machine...</option>
                    {machines.map((m: any) => <option key={m.id} value={m.id}>{m.machineCode} - {m.serialNo}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {selectedType === "Spray Paint" && (
            <>
              <h2 className="text-lg font-bold text-blue-900 mt-6 border-b border-blue-100 pb-2">Spray Painting Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Part Name</label>
                  <input type="text" name="partName" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Part Number</label>
                  <input type="text" name="partNumber" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Painting SAN No</label>
                  <input type="text" name="paintingSanNo" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Painter</label>
                  <select name="painterId" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm">
                    <option value="">Select Painter...</option>
                    {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Painting Method</label>
                  <input type="text" name="paintingMethod" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Painting Specification</label>
                  <input type="text" name="paintingSpecification" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Paint Thickness Spec</label>
                  <input type="text" name="paintThicknessSpecification" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Measured Total Paint Thickness</label>
                  <input type="text" name="measuredTotalPaintThickness" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Paint Batch No</label>
                  <input type="text" name="paintBatchNo" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">Inspection Equipment</label>
                  <input type="text" name="inspectionEquipment" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm" />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex items-center justify-end border-t border-blue-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-cyan-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Generating..." : "Generate COC"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
