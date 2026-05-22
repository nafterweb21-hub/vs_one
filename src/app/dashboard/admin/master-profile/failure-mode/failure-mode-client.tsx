"use client";

import { useState, useEffect } from "react";
import { Plus, X, AlertCircle, List } from "lucide-react";
import { getFailureModes, createFailureMode, updateFailureMode, deleteFailureMode, updateFailureModeStatus, FailureModeData } from "./actions";

type FailureModeRecord = Awaited<ReturnType<typeof getFailureModes>>[0];

export default function FailureModeClient({ initialData }: { initialData: FailureModeRecord[] }) {
  const defaultDummyData: FailureModeRecord[] = [
    {
      id: "dummy-1",
      failureMode: "Coating",
      remark: "Coating thickness not within specification.",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "dummy-2",
      failureMode: "Welding Defect",
      remark: "Porosity in weld joint.",
      status: "Inactive",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "dummy-3",
      failureMode: "Dimensional",
      remark: "Out of tolerance.",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const [failureModes, setFailureModes] = useState<FailureModeRecord[]>(initialData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialData.length === 0) {
      const stored = localStorage.getItem("failureModes_data");
      if (stored) {
        try {
          // Parse and restore Date objects
          const parsed = JSON.parse(stored).map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }));
          setFailureModes(parsed);
        } catch (e) {
          setFailureModes(defaultDummyData);
        }
      } else {
        setFailureModes(defaultDummyData);
        localStorage.setItem("failureModes_data", JSON.stringify(defaultDummyData));
      }
    }
  }, [initialData]);

  // Helper to sync state to localStorage whenever it changes
  const saveFailureModes = (updater: (prev: FailureModeRecord[]) => FailureModeRecord[]) => {
    setFailureModes((prev) => {
      const next = updater(prev);
      localStorage.setItem("failureModes_data", JSON.stringify(next));
      return next;
    });
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [failureModeToDelete, setFailureModeToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState<FailureModeData>({
    failureMode: "",
    remark: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      failureMode: "",
      remark: "",
    });
    setEditingId(null);
    setError(null);
    setIsFormOpen(false);
  };

  const handleEdit = (record: FailureModeRecord) => {
    setFormData({
      failureMode: record.failureMode,
      remark: record.remark || "",
    });
    setEditingId(record.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setFailureModeToDelete(id);
  };

  const confirmDelete = async () => {
    if (!failureModeToDelete) return;
    setDeleting(true);
    
    if (failureModeToDelete.startsWith("dummy-")) {
      saveFailureModes((prev) => prev.filter((j) => j.id !== failureModeToDelete));
      setFailureModeToDelete(null);
      setDeleting(false);
      return;
    }
    
    const res = await deleteFailureMode(failureModeToDelete);
    if (res.success) {
      saveFailureModes((prev) => prev.filter((j) => j.id !== failureModeToDelete));
      setFailureModeToDelete(null);
    } else {
      alert("Failed to delete failure mode.");
    }
    setDeleting(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    saveFailureModes((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
    
    if (id.startsWith("dummy-")) return;

    const res = await updateFailureModeStatus(id, newStatus);
    if (!res.success) {
      alert("Failed to update status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit: FailureModeData = {
      failureMode: formData.failureMode,
      remark: formData.remark,
    };

    if (editingId?.startsWith("dummy-")) {
      saveFailureModes((prev) =>
        prev.map((j) => (j.id === editingId ? { ...j, ...dataToSubmit } : j))
      );
      resetForm();
      setLoading(false);
      return;
    }

    try {
      const res = editingId 
        ? await updateFailureMode(editingId, dataToSubmit)
        : await createFailureMode(dataToSubmit);

      if (res.success) {
        // Clear local storage dummy overrides if backend sync succeeded!
        localStorage.removeItem("failureModes_data");
        window.location.reload(); 
      } else {
        // Fallback for local demo mode if db is not ready
        const newDummy: FailureModeRecord = {
          id: `dummy-${Date.now()}`,
          failureMode: dataToSubmit.failureMode,
          remark: dataToSubmit.remark,
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        saveFailureModes((prev) => [...prev, newDummy]);
        resetForm();
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      
      {/* Upper header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Failure Mode Profile</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This module is used to maintain list of failure modes. Information from this profile will be used in non-conformance report (NCR).
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 duration-100"
        >
          <Plus className="h-4 w-4" />
          <span>Add Failure Mode</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="overflow-hidden rounded-xl border border-blue-150/50 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900 animate-slide-in">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingId ? "Edit Failure Mode" : "Create New Failure Mode"}
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
              <div className="form-group sm:col-span-1">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Failure Mode <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.failureMode} 
                  onChange={e => setFormData({...formData, failureMode: e.target.value})} 
                  disabled={!!editingId}
                  placeholder="E.g. Coating, Welding Defect, Dimensional"
                  className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-900 dark:disabled:text-slate-400" 
                />
                {!editingId && <p className="mt-1 text-[10px] text-slate-500">Once saved, cannot be changed.</p>}
              </div>
              
              <div className="form-group sm:col-span-2">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Remark
                </label>
                <textarea 
                  rows={3} 
                  value={formData.remark || ""} 
                  onChange={e => setFormData({...formData, remark: e.target.value})} 
                  className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                ></textarea>
              </div>

            </div>
            
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-750 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button disabled={loading} type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/10"
              >
                {loading ? "Saving..." : "Save Failure Mode"}
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
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Failure Mode</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Remark</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-28 text-center">Status</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-36 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {failureModes.map((record, idx) => (
                <tr key={record.id} className="transition-colors hover:bg-blue-50/20 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350">
                  <td className="px-6 py-4 text-center font-bold text-slate-400 dark:text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{record.failureMode}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{record.remark || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value)}
                      className={`appearance-none bg-transparent outline-none cursor-pointer inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        record.status === 'Active' 
                          ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
                      <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3 font-semibold">
                    <button onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold transition-colors">
                      Edit
                    </button>
                    <span className="text-slate-200 dark:text-slate-800">|</span>
                    <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {failureModes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <p>No failure modes found. Click below to create one.</p>
                      <button
                        onClick={() => { resetForm(); setIsFormOpen(true); }}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/10"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create Failure Mode</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {failureModeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Failure Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Are you sure you want to delete this failure mode? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setFailureModeToDelete(null)}
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
