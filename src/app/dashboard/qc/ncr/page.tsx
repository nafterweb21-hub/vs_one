"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, AlertCircle, FileWarning } from "lucide-react";

export default function NcrListPage() {
  const [ncrs, setNcrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchNcrs = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/qc/ncr?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      if (!res.ok) throw new Error("Failed to fetch NCRs");
      setNcrs(await res.json());
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNcrs();
  }, [search, statusFilter]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-blue-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <span className="text-blue-500">QC</span>
            <span>/</span>
            <span className="text-blue-500">Non-Conformance</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <FileWarning size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-blue-900">Non-Conformance Reports (NCR)</h2>
              <p className="text-sm text-blue-500 mt-0.5">Manage and track non-conforming items and actions.</p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/qc/ncr/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-lg shadow-md shadow-rose-500/20 active:scale-95 transition-all duration-200 shrink-0"
        >
          <Plus size={16} /> New NCR
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-blue-200 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
          <input
            type="text"
            placeholder="Search by NCR No, Customer, or Work Order No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-blue-700 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Closed">Closed</option>
            <option value="Void">Void</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
          <p className="text-sm text-blue-500">Loading NCRs...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      ) : ncrs.length === 0 ? (
        <div className="bg-white border border-blue-200 rounded-xl p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
            <FileWarning size={22} className="text-rose-500" />
          </div>
          <p className="text-blue-600 font-semibold">No Non-Conformance Reports found.</p>
          <p className="text-xs text-blue-400 mt-1">
            Click "New NCR" to create your first report.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-blue-500 bg-blue-50/50 uppercase tracking-wider border-b border-blue-200">
                <tr>
                  <th className="px-6 py-4">NCR No</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Work Order No</th>
                  <th className="px-6 py-4 text-right">NCR Qty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {ncrs.map((ncr) => (
                  <tr key={ncr.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-blue-900">
                      <Link href={`/dashboard/qc/ncr/${ncr.id}`} className="hover:text-rose-600 transition-colors">
                        {ncr.ncrNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-blue-700">
                      {new Date(ncr.ncrDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-700">
                      {ncr.customer?.customerName || "—"}
                    </td>
                    <td className="px-6 py-4 text-blue-700">
                      {ncr.workOrderNo || "—"}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-blue-900">
                      {ncr.ncrQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        ncr.status === "Submitted"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                          : ncr.status === "Closed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ncr.status === "Void"
                          ? "bg-rose-50 text-rose-700 border-rose-200/60"
                          : "bg-amber-50 text-amber-700 border-amber-200/60"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ncr.status === "Submitted" ? "bg-indigo-500" : 
                          ncr.status === "Closed" ? "bg-emerald-500" : 
                          ncr.status === "Void" ? "bg-rose-500" : 
                          "bg-amber-500"
                        }`} />
                        {ncr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/qc/ncr/${ncr.id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 text-blue-600 transition-colors text-xs font-medium"
                        >
                          View / Edit
                        </Link>
                      </div>
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
