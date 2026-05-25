"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  Edit2,
  AlertCircle,
  FileText,
  Printer,
  CheckCircle2,
  Send,
  Ban,
  GitBranch,
  X,
  XCircle,
} from "lucide-react";

const STATUS_TABS = [
  "All",
  "Draft",
  "Pending For Approval",
  "Approved",
  "Rejected",
  "Issued",
  "Old Version",
  "Revised",
  "Void",
] as const;

type PoSubcon = {
  id: string;
  poNo: string;
  revision: number;
  poDate: string;
  status: string;
  workOrderNo: string | null;
  amountBeforeTax: string | number;
  taxAmount: string | number | null;
  amountAfterTax: string | number;
  supplier?: { supplierName: string };
  purchaser?: { name: string };
  currency?: { code: string };
  taxType?: { taxType: string; taxRate: number } | null;
  receiveStatus: string;
};

export default function PoSubconListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<PoSubcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("All");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [popupMsg, setPopupMsg] = useState<{ title: string; message: string } | null>(null);

  const toastParam = searchParams.get("toast");
  useEffect(() => {
    if (!toastParam) return;
    if (toastParam === "updated") setToast("PO updated successfully.");
    else if (toastParam === "created") setToast("PO created successfully.");
    const t = setTimeout(() => setToast(null), 4000);
    router.replace("/dashboard/purchase/subcon");
    return () => clearTimeout(t);
  }, [toastParam, router]);

  const fetchRows = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(
        `/api/purchase/subcon?search=${encodeURIComponent(search)}&status=${tab}`,
      );
      if (!res.ok) throw new Error("Failed to fetch PO Subcons");
      setRows(await res.json());
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [search, tab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) || null,
    [rows, selectedId],
  );

  async function callAction(
    id: string,
    action: "submit" | "approve1" | "approve2" | "reject" | "issue" | "void" | "revise",
  ) {
    const res = await fetch(`/api/purchase/subcon/${id}/transition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setPopupMsg({ title: "Error", message: err.error || `Failed: ${action}` });
      return null;
    }
    return res.json();
  }

  async function onSubmitApproval() {
    if (!selected) return;
    if (selected.status !== "Draft" && selected.status !== "Rejected") return setPopupMsg({ title: "Invalid Action", message: "Only Draft/Rejected can be submitted" });
    await callAction(selected.id, "submit");
    fetchRows();
  }
  async function onApprove() {
    if (!selected) return;
    if (selected.status !== "Pending For Approval") return setPopupMsg({ title: "Invalid Action", message: "Not pending approval" });
    await callAction(selected.id, "approve1"); // Simplify tier handling
    fetchRows();
  }
  async function onReject() {
    if (!selected) return;
    if (selected.status !== "Pending For Approval") return setPopupMsg({ title: "Invalid Action", message: "Not pending approval" });
    await callAction(selected.id, "reject");
    fetchRows();
  }
  async function onIssue() {
    if (!selected) return;
    if (selected.status !== "Approved") return setPopupMsg({ title: "Invalid Action", message: "Only Approved POs can be Issued" });
    await callAction(selected.id, "issue");
    fetchRows();
  }
  async function onVoid() {
    if (!selected) return;
    if (!confirm(`Void PO ${selected.poNo}?`)) return;
    await callAction(selected.id, "void");
    fetchRows();
  }
  async function onRevise() {
    if (!selected) return;
    if (!confirm(`Create a new revision of ${selected.poNo}?`)) return;
    const res = await callAction(selected.id, "revise");
    if (res?.id) router.push(`/dashboard/purchase/subcon/${res.id}`);
  }
  function onEdit() {
    if (!selected) return;
    if (selected.status !== "Draft" && selected.status !== "Rejected") return setPopupMsg({ title: "Invalid Action", message: "Only Draft or Rejected can be edited" });
    router.push(`/dashboard/purchase/subcon/${selected.id}`);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 relative">
      {popupMsg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between bg-red-50">
              <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {popupMsg.title}
              </h3>
              <button onClick={() => setPopupMsg(null)} className="text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-blue-900 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner">
                {popupMsg.message}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-blue-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setPopupMsg(null)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-blue-900 px-4 py-3.5 text-xs font-bold text-white shadow-xl border border-blue-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          {toast}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-blue-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <span className="text-blue-500">Purchase</span>
            <span>/</span>
            <span className="text-blue-500">PO Subcon</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-blue-900">Purchase Order - Subcon</h2>
              <p className="text-sm text-blue-500 mt-0.5">Manage sub-contractor purchase orders.</p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/purchase/subcon/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg shadow-md active:scale-95 transition-all duration-200 shrink-0"
        >
          <Plus size={16} /> New PO Subcon
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-blue-200 p-3 rounded-xl shadow-sm">
        <ToolbarBtn icon={<Edit2 size={14} />} label="Edit" onClick={onEdit} disabled={!selected || (selected.status !== "Draft" && selected.status !== "Rejected")} />
        <ToolbarBtn icon={<Send size={14} />} label="Submit for Approval" onClick={onSubmitApproval} disabled={!selected || (selected.status !== "Draft" && selected.status !== "Rejected")} />
        <ToolbarBtn icon={<CheckCircle2 size={14} />} label="Approve" onClick={onApprove} disabled={!selected || selected.status !== "Pending For Approval"} />
        <ToolbarBtn icon={<XCircle size={14} />} label="Reject" onClick={onReject} disabled={!selected || selected.status !== "Pending For Approval"} />
        <ToolbarBtn icon={<Send size={14} />} label="Issue" onClick={onIssue} disabled={!selected || selected.status !== "Approved"} />
        <ToolbarBtn icon={<GitBranch size={14} />} label="Revise" onClick={onRevise} disabled={!selected || (selected.status !== "Approved" && selected.status !== "Issued")} />
        <ToolbarBtn icon={<Ban size={14} />} label="Void" onClick={onVoid} disabled={!selected} />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              tab === t
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            }`}
          >
            {t} {counts[t] != null ? `(${counts[t]})` : ""}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-blue-200 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
          <input
            type="text"
            placeholder="Search by PO No, Work Order No or Supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm text-blue-500">Loading...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-blue-200 rounded-xl p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <FileText size={22} className="text-amber-500" />
          </div>
          <p className="text-blue-600 font-semibold">No purchase orders found.</p>
        </div>
      ) : (
        <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-blue-500 bg-blue-50/50 uppercase tracking-wider border-b border-blue-200">
                <tr>
                  <th className="px-3 py-3 w-10"></th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">PO No</th>
                  <th className="px-3 py-3">Rev</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Purchaser</th>
                  <th className="px-3 py-3">Supplier</th>
                  <th className="px-3 py-3">Work Order</th>
                  <th className="px-3 py-3">Currency</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                  <th className="px-3 py-3 text-right">Tax</th>
                  <th className="px-3 py-3 text-right">Total Amount</th>
                  <th className="px-3 py-3">Receive Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id === selectedId ? null : r.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedId === r.id ? "bg-amber-50/70" : "hover:bg-blue-50/50"
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="radio"
                        checked={selectedId === r.id}
                        onChange={() => setSelectedId(r.id)}
                        className="accent-amber-500"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-3 py-3 font-bold text-blue-900">
                      <Link
                        href={`/dashboard/purchase/subcon/${r.id}`}
                        className="hover:text-amber-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {r.poNo}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-blue-700">{r.revision}</td>
                    <td className="px-3 py-3 text-blue-700">
                      {new Date(r.poDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 text-blue-700">{r.purchaser?.name || "—"}</td>
                    <td className="px-3 py-3 font-medium text-blue-700">
                      {r.supplier?.supplierName || "—"}
                    </td>
                    <td className="px-3 py-3 text-blue-700">{r.workOrderNo || "—"}</td>
                    <td className="px-3 py-3 text-blue-700">{r.currency?.code || "—"}</td>
                    <td className="px-3 py-3 text-right font-mono text-blue-900">
                      {Number(r.amountBeforeTax).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-blue-700">
                      {Number(r.taxAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold text-blue-900">
                      {Number(r.amountAfterTax).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-blue-700">{r.receiveStatus}</td>
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

function ToolbarBtn({
  icon,
  label,
  onClick,
  disabled,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
        primary
          ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500"
          : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Issued"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : status === "Draft"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "Pending For Approval"
      ? "bg-orange-50 text-orange-700 border-orange-200"
      : status === "Rejected"
      ? "bg-red-50 text-red-700 border-red-200"
      : status === "Void"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : status === "Old Version"
      ? "bg-slate-100 text-slate-600 border-slate-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}
