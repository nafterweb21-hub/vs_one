"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Edit2, AlertCircle, FileText } from "lucide-react";
import { getInvoices } from "./invoice.actions";

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchInvoicesList = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await getInvoices();
      if (!result.success) throw new Error(result.error);
      setInvoices(result.data || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesList();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) || 
                          (inv.customer?.customerName || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-blue-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <span className="text-blue-500">Sales</span>
            <span>/</span>
            <span className="text-blue-500">Invoices</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-blue-900">Invoices</h2>
              <p className="text-sm text-blue-500 mt-0.5">Manage customer invoices and billing.</p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/sales/invoice/form"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-md shadow-indigo-500/20 active:scale-95 transition-all duration-200 shrink-0"
        >
          <Plus size={16} /> New Invoice
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-blue-200 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
          <input
            type="text"
            placeholder="Search by Invoice No or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-blue-700 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Void">Void</option>
            <option value="Old Version">Old Version</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-blue-500">Loading invoices...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-white border border-blue-200 rounded-xl p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <FileText size={22} className="text-indigo-500" />
          </div>
          <p className="text-blue-600 font-semibold">No invoices found.</p>
          <p className="text-xs text-blue-400 mt-1">
            Click &quot;New Invoice&quot; to create your first invoice.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-blue-500 bg-blue-50/50 uppercase tracking-wider border-b border-blue-200">
                <tr>
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-blue-900">
                      <Link href={`/dashboard/sales/invoice/form?id=${inv.id}`} className="hover:text-indigo-600 transition-colors">
                        {inv.invoiceNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-blue-700">
                      {new Date(inv.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-700">
                      {inv.customer?.customerName || "—"}
                    </td>
                    <td className="px-6 py-4 text-blue-700">
                      {inv.invoiceType}
                    </td>
                    <td className="px-6 py-4 text-blue-700 font-semibold">
                      {inv.currency?.code} {Number(inv.amountAfterTax).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        inv.status === "Submitted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          : inv.status === "Void"
                          ? "bg-rose-50 text-rose-700 border-rose-200/60"
                          : inv.status === "Old Version"
                          ? "bg-slate-50 text-slate-700 border-slate-200/60"
                          : "bg-amber-50 text-amber-700 border-amber-200/60"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === "Submitted" ? "bg-emerald-500" : inv.status === "Void" ? "bg-rose-500" : inv.status === "Old Version" ? "bg-slate-500" : "bg-amber-500"
                        }`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/sales/invoice/form?id=${inv.id}`}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 text-blue-600 transition-colors active:scale-95"
                          title="Edit/View"
                        >
                          <Edit2 size={14} />
                        </Link>
                        {inv.status === "Submitted" && (
                          <Link
                            href={`/print/invoice/${inv.id}`}
                            target="_blank"
                            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 text-blue-600 transition-colors active:scale-95"
                            title="Print"
                          >
                            <FileText size={14} />
                          </Link>
                        )}
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
