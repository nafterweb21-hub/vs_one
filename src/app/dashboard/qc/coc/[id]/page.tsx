import React from "react";
import Link from "next/link";
import { getCocDetail } from "../actions";
import CocActionButtons from "./CocActionButtons";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CocDetailPage({ params }: { params: { id: string } }) {
  const { data: coc, success, error } = await getCocDetail(params.id);

  if (!success) {
    return (
      <div className="p-6 text-rose-600 bg-rose-50 rounded-lg max-w-5xl mx-auto mt-6">
        Error: {error}
      </div>
    );
  }

  if (!coc) {
    notFound();
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full bg-blue-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-900">
            COC Details: {coc.cocNo}
          </h1>
          <p className="text-sm text-blue-500 mt-1">
            Created on {new Date(coc.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/qc/coc"
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            Back to List
          </Link>
          <CocActionButtons cocId={coc.id} status={coc.status} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-900">General Information</h3>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${coc.status === 'Approved' ? 'bg-green-100 text-green-800' : coc.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {coc.status}
          </span>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Customer</p>
            <p className="text-base text-blue-900">{coc.customer?.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Type</p>
            <p className="text-base text-blue-900">{coc.cocType?.type}</p>
          </div>
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Delivery Order No</p>
            <p className="text-base text-blue-900">{coc.deliveryOrder?.doNo}</p>
          </div>
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Work Order No</p>
            <p className="text-base text-blue-900">{coc.workOrderNo}</p>
          </div>
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Description</p>
            <p className="text-base text-blue-900">{coc.description || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Drawing No</p>
            <p className="text-base text-blue-900">{coc.drawingNo || "-"}</p>
          </div>
        </div>
      </div>

      {(coc.cocType?.type === "Welding" || coc.cocType?.type === "Spray Paint") && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/50">
            <h3 className="text-lg font-bold text-blue-900">{coc.cocType?.type} Details</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            {coc.cocType?.type === "Welding" && (
              <>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">SAN No</p>
                  <p className="text-base text-blue-900">{coc.sanNo || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Welding Process</p>
                  <p className="text-base text-blue-900">{coc.weldingProcess || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Welder</p>
                  <p className="text-base text-blue-900">{coc.welder?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Welding Machine</p>
                  <p className="text-base text-blue-900">{coc.weldingMachine?.machineCode || "-"}</p>
                </div>
              </>
            )}
            
            {coc.cocType?.type === "Spray Paint" && (
              <>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Part Name / Number</p>
                  <p className="text-base text-blue-900">{coc.partName || "-"} / {coc.partNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Painter</p>
                  <p className="text-base text-blue-900">{coc.painter?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Painting Method</p>
                  <p className="text-base text-blue-900">{coc.paintingMethod || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500 font-semibold mb-1">Measured Total Paint Thickness</p>
                  <p className="text-base text-blue-900">{coc.measuredTotalPaintThickness || "-"}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/50">
          <h3 className="text-lg font-bold text-blue-900">Signatures</h3>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Checked By</p>
            <p className="text-base text-blue-900 font-medium">
              {coc.checkedBy ? `${coc.checkedBy.name} (${coc.checkedBy.code})` : "Pending"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">Approved By</p>
            <p className="text-base text-blue-900 font-medium">
              {coc.approvedBy ? `${coc.approvedBy.name} (${coc.approvedBy.code})` : "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
