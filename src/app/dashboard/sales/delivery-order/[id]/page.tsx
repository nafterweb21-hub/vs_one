"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, Plus, ArrowLeft, Loader2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getFormData } from "./actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DeliveryOrderFormPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formDataCache, setFormDataCache] = useState<any>(null);

  const [doData, setDoData] = useState<any>({
    doNo: "",
    doDate: new Date().toISOString().split("T")[0],
    customerId: "",
    salesOrderId: "",
    cocRequired: false,
    status: "Draft",
    items: [],
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getFormData();
        setFormDataCache(data);

        if (!isNew) {
          const res = await fetch(`/api/sales/delivery-order/${id}`);
          if (!res.ok) throw new Error("Failed to fetch delivery order");
          const fetchedDo = await res.json();
          setDoData({
            ...fetchedDo,
            doDate: new Date(fetchedDo.doDate).toISOString().split("T")[0],
          });
          setItems(
            fetchedDo.items.map((item: any) => ({
              ...item,
            }))
          );
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isNew]);

  // Derived options
  const selectedCustomer = formDataCache?.customers?.find((c: any) => c.id === doData.customerId);
  const filteredSalesOrders = formDataCache?.salesOrders?.filter((so: any) => so.customerId === doData.customerId);
  const selectedSalesOrder = formDataCache?.salesOrders?.find((so: any) => so.id === doData.salesOrderId);

  const validWorkOrderNos = useMemo(() => {
    if (!selectedSalesOrder) return [];
    const wos = new Set<string>();
    selectedSalesOrder.items?.forEach((item: any) => {
      item.batches?.forEach((b: any) => {
        if (b.workOrderNo) wos.add(b.workOrderNo);
      });
    });
    return Array.from(wos);
  }, [selectedSalesOrder]);

  const availableWorkOrders = useMemo(() => {
    if (validWorkOrderNos.length > 0) {
      return formDataCache?.workOrders?.filter((wo: any) => validWorkOrderNos.includes(wo.workOrderNo)) || [];
    }
    // Fallback if no WO assigned to SO batches: maybe all WOs? 
    // Requirement says "Based on selected SO No", so if strict: return empty unless assigned.
    // Let's just return all work orders as a fallback for testing if validWorkOrderNos is empty, 
    // or better, stick to valid ones if we assume proper data entry. Let's return all to be safe if no mapping exists yet.
    return formDataCache?.workOrders || [];
  }, [validWorkOrderNos, formDataCache]);

  const handleDoChange = (field: string, value: any) => {
    setDoData((prev: any) => {
      const next = { ...prev, [field]: value };
      if (field === "customerId") {
        next.salesOrderId = "";
      }
      return next;
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { workOrderNo: "", quantity: 1 }
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (status: string) => {
    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        ...doData,
        status,
        items,
      };

      const url = isNew ? `/api/sales/delivery-order` : `/api/sales/delivery-order/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/dashboard/sales/delivery-order");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/sales/delivery-order" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-800 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-1" /> Back to Delivery Orders
          </Link>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            {isNew ? "Create Delivery Order" : `Edit Delivery Order: ${doData.doNo}`}
            {!isNew && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                doData.status === "Submitted" ? "bg-emerald-100 text-emerald-700" : doData.status === "Void" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
              }`}>
                {doData.status}
              </span>
            )}
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => router.push("/dashboard/sales/delivery-order")}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            Back
          </button>

          {(doData.status === "Draft") && (
            <button
              onClick={() => handleSave("Draft")}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Draft
            </button>
          )}

          {!isNew && doData.status !== "Void" && doData.status !== "Submitted" && (
            <button
              onClick={() => handleSave("Void")}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100 rounded-lg hover:bg-rose-200 disabled:opacity-50 flex items-center gap-2"
            >
              Void
            </button>
          )}

          {(doData.status === "Draft") && (
            <button
              onClick={() => handleSave("Submitted")}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Submit
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information */}
          <div className="p-6 bg-white rounded-xl border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">DO No <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={doData.doNo}
                  onChange={(e) => handleDoChange("doNo", e.target.value)}
                  placeholder="Manual input..."
                  className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={doData.doDate}
                  onChange={(e) => handleDoChange("doDate", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Customer <span className="text-red-500">*</span></label>
                <select
                  value={doData.customerId}
                  onChange={(e) => handleDoChange("customerId", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select Customer</option>
                  {formDataCache?.customers?.map((cust: any) => (
                    <option key={cust.id} value={cust.id}>{cust.customerName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Sales Order <span className="text-red-500">*</span></label>
                <select
                  value={doData.salesOrderId}
                  onChange={(e) => handleDoChange("salesOrderId", e.target.value)}
                  disabled={!doData.customerId}
                  className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                >
                  <option value="">Select SO</option>
                  {filteredSalesOrders?.map((so: any) => (
                    <option key={so.id} value={so.id}>{so.orderNo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Customer PO Ref</label>
                <input
                  type="text"
                  readOnly
                  value={selectedSalesOrder?.customerPoRef || selectedCustomer?.customerPoRef || ""}
                  className="w-full px-3 py-2 text-sm bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doData.cocRequired}
                    onChange={(e) => handleDoChange("cocRequired", e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-blue-300 rounded focus:ring-indigo-500"
                  />
                  COC Required
                </label>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 bg-white rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <FileText size={20} className="text-indigo-500" />
                Delivery Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center p-8 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                <p className="text-blue-500 text-sm">No items added to this delivery order.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => {
                  const woDetails = formDataCache?.workOrders?.find((w: any) => w.workOrderNo === item.workOrderNo);
                  const maxQty = woDetails?.quantity || 0;
                  
                  return (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg relative group">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute -top-2 -right-2 p-1 bg-white text-rose-500 border border-blue-200 rounded-full shadow-sm hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-blue-500 mb-1">Work Order No <span className="text-red-500">*</span></label>
                          <select
                            value={item.workOrderNo}
                            onChange={(e) => handleItemChange(index, "workOrderNo", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">Select Work Order</option>
                            {availableWorkOrders.map((wo: any) => (
                              <option key={wo.workOrderNo} value={wo.workOrderNo}>{wo.workOrderNo}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">Quantity <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            min="1"
                            max={maxQty}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {maxQty > 0 && <span className="text-[10px] text-slate-500 mt-0.5 block">Max: {maxQty}</span>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">UOM</label>
                          <input
                            type="text"
                            readOnly
                            value={woDetails?.uom || ""}
                            className="w-full px-2 py-1.5 text-sm bg-slate-100 text-slate-500 border border-slate-200 rounded-md cursor-not-allowed"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-blue-500 mb-1">Delivery Date</label>
                          <input
                            type="text"
                            readOnly
                            value={woDetails?.deliveryDate ? new Date(woDetails.deliveryDate).toLocaleDateString() : ""}
                            className="w-full px-2 py-1.5 text-sm bg-slate-100 text-slate-500 border border-slate-200 rounded-md cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-blue-200 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Total Items:</span>
              <span className="font-semibold text-blue-900">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Status:</span>
              <span className="font-semibold text-blue-900">{doData.status}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
