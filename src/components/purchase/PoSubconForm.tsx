"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Save, X } from "lucide-react";

export default function PoSubconForm({
  initialData,
  mode,
}: {
  initialData?: any;
  mode: "create" | "edit" | "view";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    poDate: initialData?.poDate ? new Date(initialData.poDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    companyId: initialData?.companyId || "",
    purchaserId: initialData?.purchaserId || "",
    supplierId: initialData?.supplierId || "",
    workOrderNo: initialData?.workOrderNo || "",
    currencyId: initialData?.currencyId || "",
    exchangeRate: initialData?.exchangeRate || "1",
    taxTypeId: initialData?.taxTypeId || "",
    millCert: initialData?.millCert || false,
    certOfConformance: initialData?.certOfConformance || false,
    contactPersonId: initialData?.contactPersonId || "",
    tel: initialData?.tel || "",
    fax: initialData?.fax || "",
    mobile: initialData?.mobile || "",
    email: initialData?.email || "",
    poRemark: initialData?.poRemark || "",
    items: initialData?.items?.map((it: any) => ({
      ...it,
      deliveryDate: new Date(it.deliveryDate).toISOString().slice(0, 10),
    })) || [],
  });

  const [profiles, setProfiles] = useState<any>({});

  useEffect(() => {
    fetch("/api/purchase/subcon/form-data?t=" + Date.now())
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch(console.error);
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          quantity: 1,
          uomId: "",
          unitPrice: 0,
          inProcessId: "",
          mainProcessId: "",
          routingProcessId: "",
          hardness: "",
          thickness: "",
          deliveryDate: formData.poDate,
          remark: "",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const subTotal = formData.items.reduce((acc: number, it: any) => acc + (Number(it.unitPrice) * Number(it.quantity)), 0);
    const taxRate = profiles.taxProfiles?.find((t: any) => t.id === formData.taxTypeId)?.taxRate || 0;
    const taxAmount = subTotal * (taxRate / 100);
    return { subTotal, taxAmount, total: subTotal + taxAmount };
  };

  const totals = calculateTotals();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const url = mode === "create" ? `/api/purchase/subcon` : `/api/purchase/subcon/${initialData.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save PO");
      }

      const saved = await res.json();
      router.push(`/dashboard/purchase/subcon?toast=${mode === "create" ? "created" : "updated"}`);
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const isView = mode === "view";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            {mode === "create" ? "New Purchase Order Subcon" : mode === "edit" ? `Edit PO ${initialData.poNo}` : `View PO ${initialData.poNo}`}
          </h1>
          {initialData && <p className="text-sm text-blue-500 mt-1">Status: {initialData.status}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/purchase/subcon")}
            className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            Cancel
          </button>
          {!isView && (
            <button
              onClick={onSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              <Save className="w-4 h-4" /> Save
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <X className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">PO No</label>
            <input
              type="text"
              value={initialData?.poNo || profiles?.nextPoNo || ""}
              placeholder="POYYXXXXX"
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">PO Date</label>
            <input
              type="date"
              value={formData.poDate}
              onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Revision</label>
            <input
              type="text"
              value={initialData?.revision ?? 0}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Status</label>
            <input
              type="text"
              value={initialData?.status || "Draft"}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Company</label>
            <select
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
              required
            >
              <option value="">Select Company</option>
              {profiles.companyProfiles?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Purchaser</label>
            <select
              value={formData.purchaserId}
              onChange={(e) => setFormData({ ...formData, purchaserId: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
              required
            >
              <option value="">Select Purchaser</option>
              {profiles.employees?.map((e: any) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Supplier</label>
            <select
              value={formData.supplierId}
              onChange={(e) => {
                const supplierId = e.target.value;
                const supplier = profiles.supplierProfiles?.find((s: any) => s.id === supplierId);
                const defaultContact = supplier?.contactPersons?.find((cp: any) => cp.isDefault) || supplier?.contactPersons?.[0];
                setFormData({ 
                  ...formData, 
                  supplierId, 
                  contactPersonId: defaultContact ? defaultContact.id : "",
                  tel: defaultContact?.telNo || "",
                  fax: defaultContact?.faxNo || "",
                  mobile: defaultContact?.mobileNo || "",
                  email: defaultContact?.email || ""
                });
              }}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
              required
            >
              <option value="">Select Supplier</option>
              {profiles.supplierProfiles?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.supplierName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Work Order No</label>
            <select
              value={formData.workOrderNo}
              onChange={async (e) => {
                const woNo = e.target.value;
                setFormData((prev: any) => ({ ...prev, workOrderNo: woNo }));
                if (woNo) {
                  try {
                    const res = await fetch(`/api/purchase/subcon/work-order-routing?workOrderNo=${woNo}`);
                    if (res.ok) {
                      const data = await res.json();
                      const routingList: any[] = [];
                      data.inProcesses?.forEach((ip: any) => {
                        ip.routingProcesses?.forEach((rp: any) => {
                          routingList.push({
                            inProcessId: ip.id,
                            inProcessDescription: ip.description,
                            mainProcessId: rp.mainProcess?.id || "",
                            mainProcess: rp.mainProcess?.process || "",
                            routingProcessId: rp.routingProcess?.id || "",
                            routingProcess: rp.routingProcess?.routingProcess || "",
                          });
                        });
                      });

                      setFormData((prev: any) => {
                        if (routingList.length === 0) {
                          return {
                            ...prev,
                            items: prev.items.map((it: any) => ({
                              ...it,
                              inProcessId: "",
                              inProcessDescription: "",
                              mainProcessId: "",
                              mainProcess: "",
                              routingProcessId: "",
                              routingProcess: "",
                            }))
                          };
                        }
                        
                        // Map routing list to items, keeping description/qty if it's the first one, or generating new ones
                        const newItems = routingList.map((rt, idx) => {
                          const existing = prev.items[idx] || {
                            description: "",
                            quantity: 1,
                            uomId: "",
                            unitPrice: 0,
                            deliveryDate: prev.poDate,
                            remark: "",
                          };
                          return { ...existing, ...rt };
                        });
                        return { ...prev, items: newItems };
                      });
                    }
                  } catch (err) {
                    console.error("Failed to fetch routing", err);
                  }
                } else {
                  setFormData((prev: any) => ({
                    ...prev,
                    items: prev.items.map((it: any) => ({
                      ...it,
                      inProcessId: "",
                      inProcessDescription: "",
                      mainProcessId: "",
                      mainProcess: "",
                      routingProcessId: "",
                      routingProcess: "",
                    }))
                  }));
                }
              }}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            >
              <option value="">Select Work Order</option>
              {profiles.workOrders?.map((w: any) => (
                <option key={w.workOrderNo} value={w.workOrderNo}>
                  {w.workOrderNo} {w.jobDescription ? `- ${w.jobDescription}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Currency</label>
            <select
              value={formData.currencyId}
              onChange={(e) => {
                const c = profiles.currencies?.find((x: any) => x.id === e.target.value);
                setFormData({ ...formData, currencyId: e.target.value, exchangeRate: c?.exchangeRate || 1 });
              }}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
              required
            >
              <option value="">Select Currency</option>
              {profiles.currencies?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Tax Type</label>
            <select
              value={formData.taxTypeId}
              onChange={(e) => setFormData({ ...formData, taxTypeId: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            >
              <option value="">No Tax</option>
              {profiles.taxProfiles?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.taxType} ({t.taxRate}%)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Tax Rate</label>
            <input
              type="text"
              value={profiles?.taxProfiles?.find((t: any) => t.id === formData.taxTypeId)?.taxRate || initialData?.taxRate || ""}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">PO Amount Before Tax</label>
            <input
              type="text"
              value={totals.subTotal.toFixed(2)}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Tax Amount</label>
            <input
              type="text"
              value={totals.taxAmount.toFixed(2)}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">PO Amount After Tax</label>
            <input
              type="text"
              value={totals.total.toFixed(2)}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Contact Person</label>
            <select
              value={formData.contactPersonId}
              onChange={(e) => {
                const contactId = e.target.value;
                const supplier = profiles.supplierProfiles?.find((s: any) => s.id === formData.supplierId);
                const contact = supplier?.contactPersons?.find((cp: any) => cp.id === contactId);
                setFormData({
                  ...formData,
                  contactPersonId: contactId,
                  tel: contact?.telNo || "",
                  fax: contact?.faxNo || "",
                  mobile: contact?.mobileNo || "",
                  email: contact?.email || "",
                });
              }}
              disabled={isView || !formData.supplierId}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            >
              <option value="">Select Contact</option>
              {profiles.supplierProfiles
                ?.find((s: any) => s.id === formData.supplierId)
                ?.contactPersons?.map((cp: any) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.contactPersonName} {cp.designation ? `(${cp.designation})` : ""}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Exchange Rate</label>
            <input
              type="number"
              value={formData.exchangeRate}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Tel No</label>
            <input
              type="text"
              value={formData.tel}
              onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Fax No</label>
            <input
              type="text"
              value={formData.fax}
              onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Mobile No</label>
            <input
              type="text"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              disabled={isView}
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isView}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Approval By (1st Tier)</label>
            <input
              type="text"
              value={initialData?.approval1By?.name || "-"}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Date (1st Tier)</label>
            <input
              type="text"
              value={initialData?.approval1Date ? new Date(initialData.approval1Date).toLocaleDateString() : "-"}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Approval By (2nd Tier)</label>
            <input
              type="text"
              value={initialData?.approval2By?.name || "-"}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Date (2nd Tier)</label>
            <input
              type="text"
              value={initialData?.approval2Date ? new Date(initialData.approval2Date).toLocaleDateString() : "-"}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Receive Status</label>
            <input
              type="text"
              value={initialData?.receiveStatus || "NA"}
              readOnly
              className="w-full px-3 py-2 border border-blue-200 rounded-md bg-gray-100 text-sm cursor-not-allowed text-gray-500"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 mt-4">
              <input
                type="checkbox"
                id="millCert"
                checked={formData.millCert}
                onChange={(e) => setFormData({ ...formData, millCert: e.target.checked })}
                disabled={isView}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="millCert" className="text-sm font-semibold text-blue-900 cursor-pointer">Mill Certificate</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="certOfConformance"
                checked={formData.certOfConformance}
                onChange={(e) => setFormData({ ...formData, certOfConformance: e.target.checked })}
                disabled={isView}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="certOfConformance" className="text-sm font-semibold text-blue-900 cursor-pointer">Certificate of Conformance</label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <label className="block text-xs font-semibold text-blue-900 mb-1">Remark</label>
          <textarea
            value={formData.poRemark}
            onChange={(e) => setFormData({ ...formData, poRemark: e.target.value })}
            disabled={isView}
            rows={3}
            className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
            placeholder="Enter any remarks..."
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900">Line Items</h3>
            {!isView && (
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100"
              >
                <Plus size={16} /> Add Item
              </button>
            )}
          </div>
          <div className="space-y-4">
            {formData.items.map((item, i) => (
              <div key={i} className="border border-blue-200 rounded-lg bg-blue-50/30 p-4 relative">
                {!isView && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white rounded-full p-1.5 shadow-sm border border-red-100 transition-colors z-10"
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-10">
                  <div className="lg:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(i, "description", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">UOM</label>
                    <select
                      value={item.uomId}
                      onChange={(e) => handleItemChange(i, "uomId", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">Select UOM</option>
                      {profiles.uomProfiles?.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.uomName}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(i, "unitPrice", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Amount</label>
                    <input
                      type="text"
                      value={(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                      disabled
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-gray-100 text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Delivery Date</label>
                    <input
                      type="date"
                      value={item.deliveryDate}
                      onChange={(e) => handleItemChange(i, "deliveryDate", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">In-Process Desc</label>
                    <input
                      type="text"
                      value={item.inProcessDescription || item.inProcessId || ""}
                      disabled
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-gray-100 text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Main Process</label>
                    <input
                      type="text"
                      value={item.mainProcess || item.mainProcessId || ""}
                      disabled
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-gray-100 text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Routing Process</label>
                    <input
                      type="text"
                      value={item.routingProcess || item.routingProcessId || ""}
                      disabled
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-gray-100 text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Hardness</label>
                    <input
                      type="text"
                      value={item.hardness || ""}
                      onChange={(e) => handleItemChange(i, "hardness", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Thickness</label>
                    <input
                      type="text"
                      value={item.thickness || ""}
                      onChange={(e) => handleItemChange(i, "thickness", e.target.value)}
                      disabled={isView}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Qty Ack</label>
                    <input
                      type="text"
                      value={item.qtyAcknowledged || ""}
                      disabled
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-gray-100 text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Qty Ret</label>
                    <input
                      type="text"
                      value={item.qtyReturned || ""}
                      disabled
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-gray-100 text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-blue-800 mb-1">Remark</label>
                    <textarea
                      value={item.remark || ""}
                      onChange={(e) => handleItemChange(i, "remark", e.target.value)}
                      disabled={isView}
                      rows={1}
                      className="w-full px-2 py-1.5 border border-blue-200 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.items.length === 0 && (
              <div className="py-8 text-center text-blue-400 border-2 border-dashed border-blue-100 rounded-lg">
                No items added yet. Click &quot;Add Item&quot; to start.
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-2 text-sm text-blue-900">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{totals.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span className="font-mono font-semibold">{totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200 text-base">
                <span className="font-bold">Total Amount:</span>
                <span className="font-mono font-bold text-amber-600">{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <label className="block text-xs font-semibold text-blue-900 mb-1">Remarks</label>
          <textarea
            value={formData.poRemark}
            onChange={(e) => setFormData({ ...formData, poRemark: e.target.value })}
            disabled={isView}
            rows={3}
            className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:bg-white text-sm"
          />
        </div>
      </form>
    </div>
  );
}
