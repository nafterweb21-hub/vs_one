"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createWorkOrder, updateWorkOrder } from "../actions";

type WorkOrderFormProps = {
  initialData?: any;
  dependencies: {
    customers: { id: string; customerName: string; customerCode: string }[];
    employees: { id: string; name: string; code: string }[];
    uoms: { id: string; uomName: string }[];
  };
};

export default function WorkOrderForm({ initialData, dependencies }: WorkOrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const isEdit = !!initialData;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      workOrderNo: initialData?.workOrderNo || "",
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      customerId: initialData?.customerId || "",
      internalQuotationNo: initialData?.internalQuotationNo || "",
      customerPoRef: initialData?.customerPoRef || "",
      projectCode: initialData?.projectCode || "",
      deliveryDate: initialData?.deliveryDate ? new Date(initialData.deliveryDate).toISOString().split('T')[0] : "",
      jobDescription: initialData?.jobDescription || "",
      quantity: initialData?.quantity || "",
      uom: initialData?.uom || "",
      amount: initialData?.amount || "",
      remark: initialData?.remark || "",
      status: initialData?.status || "Draft",
      qcAcceptance: initialData?.qcAcceptance || "",
      qcById: initialData?.qcById || "",
      qcDate: initialData?.qcDate ? new Date(initialData.qcDate).toISOString().split('T')[0] : "",
      labelQty: initialData?.labelQty || "",
      labelUomId: initialData?.labelUomId || "",
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError("");

    try {
      const result = isEdit 
        ? await updateWorkOrder(initialData.workOrderNo, data)
        : await createWorkOrder(data);

      if (result.success) {
        router.push(`/dashboard/production/work-order/${result.workOrderNo}`);
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save work order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Main Order Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          General Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Work Order No <span className="text-red-500">*</span>
            </label>
            <input
              {...register("workOrderNo", { required: true, pattern: /^8\d{5}-[A-Z]-[A-Z]$/ })}
              placeholder="e.g. 812345-A-B"
              disabled={isEdit}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.workOrderNo ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'} ${isEdit ? 'bg-slate-50 text-slate-500' : ''}`}
            />
            {errors.workOrderNo && <p className="text-xs text-red-500">Format must be 8XXXXX-A-B</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("date", { required: true })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              {...register("customerId", { required: true })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Customer</option>
              {dependencies.customers.map(c => (
                <option key={c.id} value={c.id}>{c.customerName} ({c.customerCode})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Internal Quotation No</label>
            <input
              {...register("internalQuotationNo")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Customer PO Ref</label>
            <input
              {...register("customerPoRef")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Project Code</label>
            <input
              {...register("projectCode")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Delivery Date</label>
            <input
              type="date"
              {...register("deliveryDate")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Quantity</label>
            <input
              type="number"
              step="0.01"
              {...register("quantity")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">UOM</label>
            <select
              {...register("uom")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="">Select UOM</option>
              {dependencies.uoms.map(u => (
                <option key={u.id} value={u.uomName}>{u.uomName}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="Draft">Draft</option>
              <option value="Proceed">Proceed</option>
              <option value="WIP">WIP</option>
              <option value="On Hold">On Hold</option>
              <option value="Pending for QC">Pending for QC</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Void">Void</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Job Description</label>
          <textarea
            {...register("jobDescription")}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="mt-6 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Remark</label>
          <textarea
            {...register("remark")}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Label Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Label Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Label Quantity</label>
            <input
              type="number"
              step="0.01"
              {...register("labelQty")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Label UOM</label>
            <select
              {...register("labelUomId")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="">Select UOM</option>
              {dependencies.uoms.map(u => (
                <option key={u.id} value={u.id}>{u.uomName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* QC Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Quality Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">QC Acceptance</label>
            <select
              {...register("qcAcceptance")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Status</option>
              <option value="N/A">N/A</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">QC By</label>
            <select
              {...register("qcById")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Employee</option>
              {dependencies.employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">QC Date</label>
            <input
              type="date"
              {...register("qcDate")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/production/work-order")}
          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium shadow-sm shadow-blue-500/20"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Work Order"}
        </button>
      </div>
    </form>
  );
}
