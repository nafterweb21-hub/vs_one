"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, FileWarning, ArrowLeft } from "lucide-react";
import { getNcrFormData } from "./actions";

export default function NcrForm({ ncrId }: { ncrId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [customers, setCustomers] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [failureModeProfiles, setFailureModeProfiles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    ncrDate: new Date().toISOString().split("T")[0],
    customerId: "",
    workOrderNo: "",
    inProcessId: "",
    mainProcessId: "",
    routingProcessId: "",
    requestorId: "",
    responsiblePartyId: "",
    descriptionOfNonConformance: "",
    ncrQuantity: 0,
    reworkQuantity: 0,
    useAsIsQuantity: 0,
    scrapQuantity: 0,
    otherDecisions: "",
    otherQuantity: 0,
    customerAcceptanceForUseAsIs: false,
    department: "",
    failureModeIds: [] as string[],
    correctiveAction: false,
    reasonToJustify: "",
    rootCause: "",
    rootCauseResponsibleStaffId: "",
    rootCauseDate: "",
    correctivePreventiveAction: "",
    cpaResponsibleStaffId: "",
    cpaDate: "",
    followUpVerification: "",
    actionTaken: "",
    verifiedConfirmedById: "",
    verifiedConfirmedDate: "",
    status: "Draft",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dropDownData = await getNcrFormData();
        setCustomers(dropDownData.customers);
        setWorkOrders(dropDownData.workOrders);
        setEmployees(dropDownData.employees);
        setFailureModeProfiles(dropDownData.failureModeProfiles);
        setDepartments(dropDownData.departmentProfiles || []);

        if (!ncrId) {
          setFormData(prev => ({ 
            ...prev, 
            requestorId: dropDownData.loggedInEmployeeId || (dropDownData.employees[0]?.id || "") 
          }));
        }

        if (ncrId) {
          const res = await fetch(`/api/qc/ncr/${ncrId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              ...data,
              ncrDate: data.ncrDate ? new Date(data.ncrDate).toISOString().split("T")[0] : "",
              rootCauseDate: data.rootCauseDate ? new Date(data.rootCauseDate).toISOString().split("T")[0] : "",
              cpaDate: data.cpaDate ? new Date(data.cpaDate).toISOString().split("T")[0] : "",
              verifiedConfirmedDate: data.verifiedConfirmedDate ? new Date(data.verifiedConfirmedDate).toISOString().split("T")[0] : "",
              failureModeIds: data.failureModes?.map((fm: any) => fm.failureModeId) || [],
              customerAcceptanceForUseAsIs: data.customerAcceptanceForUseAsIs || false,
              correctiveAction: data.correctiveAction || false,
              ncrQuantity: data.ncrQuantity || 0,
              reworkQuantity: data.reworkQuantity || 0,
              useAsIsQuantity: data.useAsIsQuantity || 0,
              scrapQuantity: data.scrapQuantity || 0,
              otherQuantity: data.otherQuantity || 0,
            });
          }
        }
      } catch (err: any) {
        setErrorMsg("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ncrId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = parseFloat(value) || 0;
    } else if (name === "correctiveAction") {
      finalValue = value === "true";
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };
      if (['reworkQuantity', 'useAsIsQuantity', 'scrapQuantity', 'otherQuantity'].includes(name)) {
        updated.ncrQuantity = (updated.reworkQuantity || 0) + (updated.useAsIsQuantity || 0) + (updated.scrapQuantity || 0) + (updated.otherQuantity || 0);
      }
      return updated;
    });
  };

  const handleCheckboxListChange = (id: string, checked: boolean) => {
    setFormData((prev) => {
      const currentIds = new Set(prev.failureModeIds);
      if (checked) {
        currentIds.add(id);
      } else {
        currentIds.delete(id);
      }
      return { ...prev, failureModeIds: Array.from(currentIds) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const payload: any = {
        ...formData,
        ncrDate: formData.ncrDate ? new Date(formData.ncrDate).toISOString() : null,
        rootCauseDate: formData.rootCauseDate ? new Date(formData.rootCauseDate).toISOString() : null,
        cpaDate: formData.cpaDate ? new Date(formData.cpaDate).toISOString() : null,
        verifiedConfirmedDate: formData.verifiedConfirmedDate ? new Date(formData.verifiedConfirmedDate).toISOString() : null,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") {
          payload[key] = null;
        }
      });

      const res = await fetch(`/api/qc/ncr${ncrId ? `/${ncrId}` : ""}`, {
        method: ncrId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save NCR");
      }

      router.push("/dashboard/qc/ncr");
    } catch (err: any) {
      setErrorMsg(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  // Find selected work order to derive dependent fields
  const selectedWo = workOrders.find(wo => wo.workOrderNo === formData.workOrderNo);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-blue-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/qc/ncr" className="hover:text-blue-600">NCR</Link>
            <span>/</span>
            <span className="text-blue-500">{ncrId ? "Edit" : "New"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/qc/ncr" className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-blue-900">
                {ncrId ? "Edit NCR" : "Create New NCR"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section: General Info */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-blue-900 border-b border-blue-100 pb-2">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">NCR Date *</label>
              <input type="date" name="ncrDate" required value={formData.ncrDate} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Customer *</label>
              <select name="customerId" required value={formData.customerId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.customerName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Work Order No *</label>
              <select name="workOrderNo" required value={formData.workOrderNo} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                <option value="">Select Work Order</option>
                {workOrders.map(wo => (
                  <option key={wo.workOrderNo} value={wo.workOrderNo}>{wo.workOrderNo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Closed">Closed</option>
                <option value="Void">Void</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Customer Ref No</label>
              <input type="text" readOnly value={selectedWo?.customerPoRef || ""} className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Project Code</label>
              <input type="text" readOnly value={selectedWo?.projectCode || ""} className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-blue-500 mb-1">Product Description</label>
              <input type="text" readOnly value={selectedWo?.jobDescription || ""} className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600" />
            </div>
          </div>
        </div>

        {/* Section: Details & Discrepancy */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-blue-900 border-b border-blue-100 pb-2">Discrepancy Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Requestor *</label>
              <select name="requestorId" required value={formData.requestorId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                <option value="">Select Employee</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Responsible Party</label>
              <select name="responsiblePartyId" value={formData.responsiblePartyId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                <option value="">Select Employee</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-blue-500 mb-1">Description of Non-Conformance / Problem *</label>
              <textarea name="descriptionOfNonConformance" required rows={3} value={formData.descriptionOfNonConformance} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20"></textarea>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-4">
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Rework Qty</label>
              <input type="number" name="reworkQuantity" min="0" value={formData.reworkQuantity} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Use-As-Is Qty</label>
              <input type="number" name="useAsIsQuantity" min="0" value={formData.useAsIsQuantity} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Scrap Qty</label>
              <input type="number" name="scrapQuantity" min="0" value={formData.scrapQuantity} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Other Qty</label>
              <input type="number" name="otherQuantity" min="0" value={formData.otherQuantity} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Total NCR Qty</label>
              <input type="number" readOnly value={formData.ncrQuantity} className="w-full px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg text-sm" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
             <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Other Decisions Description</label>
              <input type="text" name="otherDecisions" value={formData.otherDecisions} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div className="flex items-center h-full pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="customerAcceptanceForUseAsIs" checked={formData.customerAcceptanceForUseAsIs} onChange={handleChange} className="rounded border-blue-300 text-rose-600 focus:ring-rose-500" />
                <span className="text-sm text-blue-900 font-medium">Customer Acceptance for Use-As-Is</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section: Cause & Actions */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-blue-900 border-b border-blue-100 pb-2">Cause & Corrective Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-2">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-2">Failure Mode</label>
              <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg max-h-48 overflow-y-auto">
                {failureModeProfiles.map(fm => (
                  <label key={fm.id} className="flex items-center gap-2 text-sm text-blue-800 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.failureModeIds.includes(fm.id)}
                      onChange={(e) => handleCheckboxListChange(fm.id, e.target.checked)}
                      className="rounded border-blue-300 text-rose-600 focus:ring-rose-500"
                    />
                    {fm.failureMode}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
             <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-blue-500 mb-1">Requires Corrective Action?</label>
                <select name="correctiveAction" value={formData.correctiveAction ? "true" : "false"} onChange={handleChange} className="w-full md:w-1/2 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Reason to Justify (If No Corrective Action)</label>
              <textarea name="reasonToJustify" rows={2} disabled={formData.correctiveAction === true} value={formData.reasonToJustify} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 disabled:bg-gray-100 disabled:opacity-60"></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Root Cause</label>
              <textarea name="rootCause" rows={2} value={formData.rootCause} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Responsible Staff (Root Cause)</label>
                <select name="rootCauseResponsibleStaffId" value={formData.rootCauseResponsibleStaffId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Date</label>
                <input type="date" name="rootCauseDate" value={formData.rootCauseDate} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Corrective / Preventive Action</label>
              <textarea name="correctivePreventiveAction" rows={2} value={formData.correctivePreventiveAction} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Responsible Staff (Action)</label>
                <select name="cpaResponsibleStaffId" value={formData.cpaResponsibleStaffId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Date</label>
                <input type="date" name="cpaDate" value={formData.cpaDate} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Verification */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-blue-900 border-b border-blue-100 pb-2">Verification & Follow-Up</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-500 mb-1">Follow-Up / Verification of Correction</label>
              <textarea name="followUpVerification" rows={2} value={formData.followUpVerification} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Action Taken</label>
                <select name="actionTaken" value={formData.actionTaken} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                  <option value="">Select Result</option>
                  <option value="Acceptable">Acceptable</option>
                  <option value="Not Acceptable">Not Acceptable</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Verified / Confirmed By {formData.status !== "Draft" && "*"}</label>
                <select name="verifiedConfirmedById" required={formData.status !== "Draft"} value={formData.verifiedConfirmedById} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20">
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1">Date</label>
                <input type="date" name="verifiedConfirmedDate" value={formData.verifiedConfirmedDate} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-6 p-4 bg-white/80 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg z-10">
          <Link
            href="/dashboard/qc/ncr"
            className="px-6 py-2.5 text-sm font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-lg shadow-md shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save NCR"}
          </button>
        </div>
      </form>
    </div>
  );
}
