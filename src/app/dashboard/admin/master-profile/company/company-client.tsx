"use client";

import { useState, useRef } from "react";
import { Plus, X, UploadCloud, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { getCompanies, createCompany, updateCompany, deleteCompany, updateCompanyStatus, CompanyData } from "./actions";

type CompanyRecord = Awaited<ReturnType<typeof getCompanies>>[0];

export default function CompanyClient({ initialData }: { initialData: CompanyRecord[] }) {
  const [companies, setCompanies] = useState(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState<CompanyData>({
    name: "",
    address: "",
    phoneNo: "",
    faxNo: "",
    email: "",
    website: "",
    rocNo: "",
    gstRegistrationNo: "",
    uploadUrl: "",
    logoUrl: "",
    footerUrl: "",
    logoName: "",
    footerName: "",
    allowCreatePoForWo: false,
    as9100RequirementNote: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phoneNo: "",
      faxNo: "",
      email: "",
      website: "",
      rocNo: "",
      gstRegistrationNo: "",
      uploadUrl: "",
      logoUrl: "",
      footerUrl: "",
      logoName: "",
      footerName: "",
      allowCreatePoForWo: false,
      as9100RequirementNote: false,
    });
    setEditingId(null);
    setError(null);
    setIsFormOpen(false);
  };

  const handleEdit = (company: CompanyRecord) => {
    setFormData({
      name: company.name,
      address: company.address,
      phoneNo: company.phoneNo,
      faxNo: company.faxNo,
      email: company.email,
      website: company.website,
      rocNo: company.rocNo,
      gstRegistrationNo: company.gstRegistrationNo,
      uploadUrl: company.uploadUrl,
      logoUrl: company.logoUrl,
      footerUrl: company.footerUrl,
      logoName: company.logoName,
      footerName: company.footerName,
      allowCreatePoForWo: company.allowCreatePoForWo,
      as9100RequirementNote: company.as9100RequirementNote,
    });
    setEditingId(company.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setCompanyToDelete(id);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    setDeleting(true);
    const res = await deleteCompany(companyToDelete);
    if (res.success) {
      setCompanies((prev) => prev.filter((c) => c.id !== companyToDelete));
      setCompanyToDelete(null);
    } else {
      alert("Failed to delete company.");
    }
    setDeleting(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    const res = await updateCompanyStatus(id, newStatus);
    if (!res.success) {
      alert("Failed to update status.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'footer') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        if (type === 'logo') {
          setFormData(prev => ({
            ...prev,
            uploadUrl: result.url,
            logoUrl: result.url,
            logoName: prev.logoName || result.originalName,
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            footerUrl: result.url,
            footerName: prev.footerName || result.originalName,
          }));
        }
      }
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = editingId 
      ? await updateCompany(editingId, formData)
      : await createCompany(formData);

    if (res.success) {
      window.location.reload(); 
    } else {
      setError(res.error || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      
      {/* Upper header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Company Profile</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure default settings, legal names, print marks, and organizational parameters.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 duration-100"
        >
          <Plus className="h-4 w-4" />
          <span>Add Company</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="overflow-hidden rounded-xl border border-blue-150/50 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900 animate-slide-in">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingId ? "Edit Company Records" : "Create New Company Profile"}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="form-group sm:col-span-2">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Company Name <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>
              
              <div className="form-group sm:col-span-2">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Address <span className="text-red-500">*</span></label>
                <textarea required rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"></textarea>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Phone No <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.phoneNo} onChange={e => setFormData({...formData, phoneNo: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Fax No <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.faxNo} onChange={e => setFormData({...formData, faxNo: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Email</label>
                <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Website</label>
                <input type="url" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">ROC No</label>
                <input type="text" value={formData.rocNo || ''} onChange={e => setFormData({...formData, rocNo: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">GST Registration No <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.gstRegistrationNo} onChange={e => setFormData({...formData, gstRegistrationNo: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>

              {/* Logo Upload Section */}
              <div className="form-group sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-2">Company Logo</label>
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/10 p-6 transition-colors hover:bg-blue-50/30 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                    >
                      <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Click to upload logo image</span>
                      <input type="file" ref={logoInputRef} onChange={e => handleFileUpload(e, 'logo')} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Logo Name <span className="text-red-500">*</span></label>
                      <input required type="text" value={formData.logoName} onChange={e => setFormData({...formData, logoName: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Upload URL (Logo)</label>
                      <input readOnly type="text" value={formData.uploadUrl} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Upload Section */}
              <div className="form-group sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-2">Company Footer</label>
                    <div 
                      onClick={() => footerInputRef.current?.click()}
                      className="cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/10 p-6 transition-colors hover:bg-blue-50/30 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                    >
                      <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Click to upload footer image</span>
                      <input type="file" ref={footerInputRef} onChange={e => handleFileUpload(e, 'footer')} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Footer Name <span className="text-red-500">*</span></label>
                      <input required type="text" value={formData.footerName} onChange={e => setFormData({...formData, footerName: e.target.value})} className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">Footer URL</label>
                      <input readOnly type="text" value={formData.footerUrl || ''} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="form-group sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={formData.allowCreatePoForWo} onChange={e => setFormData({...formData, allowCreatePoForWo: e.target.checked})} className="peer h-5 w-5 appearance-none rounded border border-blue-200 bg-white checked:border-blue-600 checked:bg-blue-600 dark:border-slate-700 dark:bg-slate-900" />
                    <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Allow to create PO for WO</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Controls if POs can be linked to Work Orders.</span>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={formData.as9100RequirementNote} onChange={e => setFormData({...formData, as9100RequirementNote: e.target.checked})} className="peer h-5 w-5 appearance-none rounded border border-blue-200 bg-white checked:border-blue-600 checked:bg-blue-600 dark:border-slate-700 dark:bg-slate-900" />
                    <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">AS9100 Requirement Note Required?</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Toggles the AS9100 supplier note on PO/SRF printouts.</span>
                  </div>
                </label>
              </div>

            </div>
            
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-750 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button disabled={loading} type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/10"
              >
                {loading ? "Saving..." : "Save Company Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table view */}
      <div className="overflow-hidden rounded-xl border border-blue-150/50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/45 text-blue-900/90 dark:bg-slate-950 dark:text-blue-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-16 text-center">S/N</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Company Name</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">ROC No</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">GST Reg No</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-28 text-center">Status</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-36 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {companies.map((company, idx) => (
                <tr key={company.id} className="transition-colors hover:bg-blue-50/20 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350">
                  <td className="px-6 py-4 text-center font-bold text-slate-400 dark:text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{company.name}</td>
                  <td className="px-6 py-4 font-mono">{company.rocNo || '—'}</td>
                  <td className="px-6 py-4 font-mono">{company.gstRegistrationNo}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={company.status}
                      onChange={(e) => handleStatusChange(company.id, e.target.value)}
                      className={`appearance-none bg-transparent outline-none cursor-pointer inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        company.status === 'Active' 
                          ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
                      <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3 font-semibold">
                    <button onClick={() => handleEdit(company)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold transition-colors">
                      Edit
                    </button>
                    <span className="text-slate-200 dark:text-slate-800">|</span>
                    <button onClick={() => handleDelete(company.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No companies found. Click &quot;Add Company&quot; to create a new profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {companyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Company</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Are you sure you want to delete this company? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setCompanyToDelete(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
