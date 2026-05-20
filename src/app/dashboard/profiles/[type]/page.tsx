"use client";

import { use, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Power,
  ArrowLeft,
  Loader2,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { PROFILE_REGISTRY } from "@/lib/profiles-schema";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "checkbox";
  placeholder?: string;
  required?: boolean;
}

const CURRENCY_FIELDS: FieldConfig[] = [
  { name: "code", label: "Currency Code", type: "text", required: true, placeholder: "e.g. USD" },
  { name: "name", label: "Currency Name", type: "text", required: true, placeholder: "e.g. US Dollar" },
  { name: "exchangeRate", label: "Exchange Rate", type: "number", required: true, placeholder: "e.g. 83.250" },
  { name: "isDefault", label: "Default Currency?", type: "checkbox" },
];

export default function ProfilePage({
  params,
  searchParams: _searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<any>;
}) {
  const { type } = use(params);

  const meta = PROFILE_REGISTRY[type];
  const fields = type === "currency" ? CURRENCY_FIELDS : [];

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  // Form State
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchItems();
  }, [type, search, activeOnly]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profiles/${type}?search=${encodeURIComponent(search)}&activeOnly=${activeOnly}`);
      if (!res.ok) throw new Error("Failed to load profile items");
      const data = await res.json();
      setItems(data);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setErrorMsg("");
    
    const defaults: any = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") defaults[f.name] = false;
      else defaults[f.name] = "";
    });

    setFormData(defaults);
    setShowDrawer(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setErrorMsg("");

    const data: any = {};
    fields.forEach((f) => {
      let val = item[f.name] ?? "";
      if (f.type === "number") {
        if (typeof val === "number") {
          val = val.toFixed(3);
        } else if (val && !isNaN(Number(val))) {
          val = Number(val).toFixed(3);
        }
      }
      data[f.name] = val;
    });

    setFormData(data);
    setShowDrawer(true);
  };

  const handleStatusToggle = async (item: any) => {
    try {
      const res = await fetch(`/api/profiles/${type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to toggle status");
      }
      fetchItems();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload: any = { ...formData };

      if (editingId) {
        payload.id = editingId;
      }

      const method = editingId ? "PUT" : "POST";
      const res = await fetch(`/api/profiles/${type}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save profile item");
      }

      setShowDrawer(false);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (!meta) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-4 text-xl font-bold">Invalid Profile</h2>
          <p className="mt-2 text-zinc-500">The profile type &quot;{type}&quot; does not exist.</p>
          <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase mb-1">
            <Link href="/dashboard" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-500 dark:text-zinc-400">Currency Master</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Currency Master</h2>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-lg shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200"
        >
          <Plus size={16} /> Add Currency
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search currencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer select-none">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
          />
          Active Only
        </label>
      </div>

      {/* Table & List Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-zinc-500">Loading currencies...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center shadow-sm">
          <p className="text-zinc-500 font-medium">No currencies found.</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Click &quot;Add Currency&quot; to create your first currency record.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-zinc-600 dark:text-zinc-400">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Currency Code</th>
                  <th className="px-6 py-4">Currency Name</th>
                  <th className="px-6 py-4">Exchange Rate</th>
                  <th className="px-6 py-4">Default</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-zinc-900 dark:text-white">
                      {typeof item.exchangeRate === "number"
                        ? item.exchangeRate.toFixed(3)
                        : Number(item.exchangeRate).toFixed(3)}
                    </td>
                    <td className="px-6 py-4">
                      {item.isDefault ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                          <Check size={12} className="stroke-[3]" /> Yes
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors active:scale-95"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => handleStatusToggle(item)}
                        className={`inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 ${
                          item.status === "Active"
                            ? "text-rose-600 dark:text-rose-400 hover:border-rose-100 dark:hover:bg-rose-500/10"
                            : "text-emerald-600 dark:text-emerald-400 hover:border-emerald-100 dark:hover:bg-emerald-500/10"
                        }`}
                        title={item.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        <Power size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Drawer Modal (Form Editor) */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Drawer backdrop */}
          <div
            onClick={() => setShowDrawer(false)}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-900 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10">
              <h3 className="font-bold text-lg">
                {editingId ? "Edit Currency" : "Add Currency"}
              </h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body (Form) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-sm font-medium rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {fields.map((field) => {
                const isImmutable = !!(editingId && meta.immutableFields.includes(field.name));
                
                return (
                  <div key={field.name} className="space-y-1.5">
                    {field.type !== "checkbox" && (
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-rose-500">*</span>}
                        {isImmutable && (
                          <span className="text-[10px] text-zinc-400 font-normal lowercase">
                            (locked after save)
                          </span>
                        )}
                      </label>
                    )}

                    {field.type === "text" && (
                      <input
                        type="text"
                        disabled={isImmutable}
                        value={formData[field.name] || ""}
                        placeholder={field.placeholder}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="text"
                        disabled={isImmutable}
                        value={formData[field.name] || ""}
                        placeholder={field.placeholder}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Allow digits, one optional decimal point, and up to 3 decimal digits
                          if (val === "" || /^[0-9]*\.?[0-9]{0,3}$/.test(val)) {
                            setFormData({ ...formData, [field.name]: val });
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val && !isNaN(Number(val))) {
                            setFormData({ ...formData, [field.name]: Number(val).toFixed(3) });
                          }
                        }}
                        required={field.required}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    )}

                    {field.type === "checkbox" && (
                      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          disabled={isImmutable}
                          checked={!!formData[field.name]}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                          className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                        />
                        {field.label}
                      </label>
                    )}
                  </div>
                );
              })}

              {/* Form Footer */}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-lg shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> {editingId ? "Update Currency" : "Save Currency"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
