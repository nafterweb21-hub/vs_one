"use client";

import { useState } from "react";
import { Plus, X, AlertCircle, List } from "lucide-react";
import { getJoints, createJoint, updateJoint, deleteJoint, updateJointStatus, JointData } from "./actions";

type JointRecord = Awaited<ReturnType<typeof getJoints>>[0];

export default function JointClient({ initialData }: { initialData: JointRecord[] }) {
  const [joints, setJoints] = useState(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<JointData>({
    joint: "",
    remark: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      joint: "",
      remark: "",
    });
    setEditingId(null);
    setError(null);
    setIsFormOpen(false);
  };

  const handleEdit = (jointRecord: JointRecord) => {
    setFormData({
      joint: jointRecord.joint,
      remark: jointRecord.remark || "",
    });
    setEditingId(jointRecord.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this joint?")) return;
    const res = await deleteJoint(id);
    if (res.success) {
      setJoints((prev) => prev.filter((j) => j.id !== id));
    } else {
      alert("Failed to delete joint.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setJoints((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
    const res = await updateJointStatus(id, newStatus);
    if (!res.success) {
      alert("Failed to update status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit: JointData = {
      joint: formData.joint,
      remark: formData.remark,
    };

    const res = editingId 
      ? await updateJoint(editingId, dataToSubmit)
      : await createJoint(dataToSubmit);

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
            <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Joint Profile</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Maintain list of welding type joints. Information in this profile will be used in work order - welding.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 duration-100"
        >
          <Plus className="h-4 w-4" />
          <span>Add Joint</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="overflow-hidden rounded-xl border border-blue-150/50 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900 animate-slide-in">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingId ? "Edit Joint Profile" : "Create New Joint Profile"}
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
                  Joint <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.joint} 
                  onChange={e => setFormData({...formData, joint: e.target.value})} 
                  disabled={!!editingId}
                  placeholder="E.g. Spot Weld"
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
                {loading ? "Saving..." : "Save Joint"}
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
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Joint</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Remark</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-28 text-center">Status</th>
                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-36 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {joints.map((jointRecord, idx) => (
                <tr key={jointRecord.id} className="transition-colors hover:bg-blue-50/20 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350">
                  <td className="px-6 py-4 text-center font-bold text-slate-400 dark:text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{jointRecord.joint}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{jointRecord.remark || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={jointRecord.status}
                      onChange={(e) => handleStatusChange(jointRecord.id, e.target.value)}
                      className={`appearance-none bg-transparent outline-none cursor-pointer inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        jointRecord.status === 'Active' 
                          ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
                      <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3 font-semibold">
                    <button onClick={() => handleEdit(jointRecord)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold transition-colors">
                      Edit
                    </button>
                    <span className="text-slate-200 dark:text-slate-800">|</span>
                    <button onClick={() => handleDelete(jointRecord.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {joints.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No joints found. Click &quot;Add Joint&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
