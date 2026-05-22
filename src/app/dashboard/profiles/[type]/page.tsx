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
  Coins,
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
  { name: "code",         label: "Currency Code",  type: "text",     required: true,  placeholder: "e.g. USD" },
  { name: "name",         label: "Currency Name",  type: "text",     required: true,  placeholder: "e.g. US Dollar" },
  { name: "exchangeRate", label: "Exchange Rate",  type: "number",   required: true,  placeholder: "e.g. 83.250" },
  { name: "isDefault",    label: "Default Currency?", type: "checkbox" },
];

type ViewMode = "list" | "add" | "edit";

export default function ProfilePage({
  params,
  searchParams: _searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<any>;
}) {
  const { type } = use(params);
  const meta   = PROFILE_REGISTRY[type];
  const fields = type === "currency" ? CURRENCY_FIELDS : [];

  // ── List state ──
  const [items, setItems]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [listError, setListError]   = useState("");

  // ── View mode ──
  const [viewMode, setViewMode]     = useState<ViewMode>("list");
  const [editingId, setEditingId]   = useState<string | null>(null);

  // ── Form state ──
  const [formData, setFormData]     = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");

  // ─────────────────────────────────────────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────────────────────────────────────────

  const fetchItems = async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await fetch(`/api/profiles/${type}?search=${encodeURIComponent(search)}&activeOnly=${activeOnly}`);
      if (!res.ok) throw new Error("Failed to load profile items");
      setItems(await res.json());
    } catch (e: any) {
      setListError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [type, search, activeOnly]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation helpers
  // ─────────────────────────────────────────────────────────────────────────────

  const goList = () => { setViewMode("list"); setEditingId(null); setFormError(""); };

  const goAdd = () => {
    setEditingId(null);
    setFormError("");
    const defaults: any = { status: "Active" };
    fields.forEach((f) => { defaults[f.name] = f.type === "checkbox" ? false : ""; });
    setFormData(defaults);
    setViewMode("add");
  };

  const goEdit = (item: any) => {
    setEditingId(item.id);
    setFormError("");
    const data: any = { status: item.status || "Active" };
    fields.forEach((f) => {
      let val = item[f.name] ?? "";
      if (f.type === "number" && val !== "") val = Number(val).toFixed(3);
      data[f.name] = val;
    });
    setFormData(data);
    setViewMode("edit");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────

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
    } catch (e: any) { alert(e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const payload: any = { ...formData };
      if (editingId) payload.id = editingId;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(`/api/profiles/${type}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      goList();
      fetchItems();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Not found
  // ─────────────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────────
  // Shared page header
  // ─────────────────────────────────────────────────────────────────────────────

  const isForm = viewMode === "add" || viewMode === "edit";

  const pageHeader = (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase mb-1">
          <Link href="/dashboard" className="hover:text-zinc-600 dark:hover:text-zinc-300">Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/profiles" className="hover:text-zinc-600 dark:hover:text-zinc-300">Profiles</Link>
          <span>/</span>
          {isForm ? (
            <>
              <button onClick={goList} className="hover:text-zinc-600 dark:hover:text-zinc-300">Currency Master</button>
              <span>/</span>
              <span className="text-zinc-500 dark:text-zinc-400">{viewMode === "add" ? "Add Currency" : "Edit Currency"}</span>
            </>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400">Currency Master</span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Coins size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {viewMode === "add" ? "Add Currency" : viewMode === "edit" ? "Edit Currency" : "Currency Master"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isForm
                ? "Fill in the details below and click Save."
                : "Manage currency codes, exchange rates, and default currency."}
            </p>
          </div>
        </div>
      </div>

      {/* Right action */}
      {viewMode === "list" && (
        <button
          id="btn-add-currency"
          onClick={goAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-lg shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200 shrink-0"
        >
          <Plus size={16} /> Add Currency
        </button>
      )}

      {isForm && (
        <button
          onClick={goList}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          <ArrowLeft size={16} /> Back to List
        </button>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Render — Add / Edit form (inline, no popup)
  // ─────────────────────────────────────────────────────────────────────────────

  if (isForm) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        {pageHeader}

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          {/* Form header bar */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Coins size={15} />
            </div>
            <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">Currency Information</span>
          </div>

          <form id="currency-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-sm font-medium rounded-lg flex items-center gap-2 border border-rose-200 dark:border-rose-500/20">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            {/* Fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.filter((f) => f.type !== "checkbox").map((field) => {
                const isImmutable = !!(editingId && meta.immutableFields.includes(field.name));
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-rose-500">*</span>}
                      {isImmutable && (
                        <span className="text-[10px] text-zinc-400 font-normal normal-case ml-1 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          locked
                        </span>
                      )}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        disabled={isImmutable}
                        value={formData[field.name] || ""}
                        placeholder={field.placeholder}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                        className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
                        className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono transition-colors"
                      />
                    )}
                  </div>
                );
              })}

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Status
                </label>
                <select
                  id="profile-status-input"
                  value={formData.status || "Active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Deactive</option>
                </select>
              </div>
            </div>

            {/* Checkbox fields */}
            {fields.filter((f) => f.type === "checkbox").map((field) => {
              const isImmutable = !!(editingId && meta.immutableFields.includes(field.name));
              return (
                <div key={field.name} className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  <input
                    id={`field-${field.name}`}
                    type="checkbox"
                    disabled={isImmutable}
                    checked={!!formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`field-${field.name}`} className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                    {field.label}
                  </label>
                </div>
              );
            })}

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={goList}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-lg shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {submitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving...</>
                ) : (
                  <><Check size={14} /> {editingId ? "Update Currency" : "Save Currency"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render — List view
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {pageHeader}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            id="currency-search"
            type="text"
            placeholder="Search currencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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

      {/* Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-zinc-500">Loading currencies...</p>
        </div>
      ) : listError ? (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-6 flex items-center gap-3 text-rose-700 dark:text-rose-400">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{listError}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <Coins size={22} className="text-blue-500" />
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 font-semibold">No currencies found.</p>
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
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">

                    {/* Code — clickable to edit */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => goEdit(item)}
                        className="inline-flex items-center gap-2 group/name"
                        title="Click to edit"
                      >
                        <span className="font-bold text-zinc-900 dark:text-white group-hover/name:text-blue-600 dark:group-hover/name:text-blue-400 transition-colors">
                          {item.code}
                        </span>
                        <Edit2 size={11} className="text-zinc-300 dark:text-zinc-700 group-hover/name:text-blue-500 opacity-0 group-hover/name:opacity-100 transition-all" />
                      </button>
                    </td>

                    <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">{item.name}</td>

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
                        <span className="text-zinc-300 dark:text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                        {item.status === "Active" ? "Active" : "Deactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        id={`btn-toggle-${item.id}`}
                        onClick={() => handleStatusToggle(item)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                          item.status === "Active"
                            ? "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                            : "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                        }`}
                        title={item.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        <Power size={12} />
                        {item.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
