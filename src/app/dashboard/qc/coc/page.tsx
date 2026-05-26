import React from "react";
import Link from "next/link";
import { getCocsList } from "./actions";

export const dynamic = "force-dynamic";

export default async function CocListPage() {
  const { data: cocs = [], success, error } = await getCocsList();

  if (!success) {
    return (
      <div className="p-6">
        <div className="bg-rose-50 text-rose-600 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full bg-blue-50 h-full min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-900">
            Certificate of Conformity (COC)
          </h1>
          <p className="text-sm text-blue-500 mt-1">
            Manage COCs generated for Delivery Orders.
          </p>
        </div>
        <Link
          href="/dashboard/qc/coc/new"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-cyan-500 transition-colors"
        >
          Add COC
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-blue-900">
            <thead className="bg-blue-50 text-blue-900 font-semibold border-b border-blue-200">
              <tr>
                <th className="px-4 py-3">COC No</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">WO No</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {cocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-blue-500">
                    No COCs found. Click "Add COC" to create one.
                  </td>
                </tr>
              ) : (
                cocs.map((coc: any) => (
                  <tr key={coc.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-cyan-700">
                      <Link href={`/dashboard/qc/coc/${coc.id}`}>
                        {coc.cocNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(coc.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{coc.cocType?.type}</td>
                    <td className="px-4 py-3">
                      {coc.customer?.customerName || coc.customerId}
                    </td>
                    <td className="px-4 py-3">{coc.workOrderNo}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${coc.status === 'Approved' ? 'bg-green-100 text-green-800' : coc.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {coc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/qc/coc/${coc.id}`}
                        className="text-cyan-600 hover:text-cyan-500 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
