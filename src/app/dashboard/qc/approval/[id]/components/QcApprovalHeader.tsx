"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { approveQc, rejectQc } from "../../actions";

type Props = {
  wo: any;
};

export default function QcApprovalHeader({ wo }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [rejectRemark, setRejectRemark] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  function handleApprove() {
    setError("");
    startTransition(async () => {
      const res = await approveQc(wo.workOrderNo);
      if (!res.success) setError(res.error || "Failed to approve");
      else router.push("/dashboard/qc/approval");
    });
  }

  function handleReject() {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await rejectQc(wo.workOrderNo, rejectRemark);
      if (!res.success) setError(res.error || "Failed to reject");
      else router.push("/dashboard/qc/approval");
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Status: {wo.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            wo.qcAcceptance === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
            wo.qcAcceptance === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
            'bg-slate-100 text-slate-700'
          }`}>
            QC: {wo.qcAcceptance || "Pending"}
          </span>
        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end">
          {showRejectInput && (
            <input
              type="text"
              placeholder="Rejection remark..."
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
              disabled={isPending}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg w-64 focus:outline-none focus:border-rose-500"
            />
          )}
          <button
            onClick={handleReject}
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 bg-rose-100 text-rose-700 hover:bg-rose-200"
          >
            {showRejectInput ? "Confirm Reject" : "Reject"}
          </button>
          
          {!showRejectInput && (
            <button
              onClick={handleApprove}
              disabled={isPending}
              className="px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Approve
            </button>
          )}

          {showRejectInput && (
            <button
              onClick={() => {
                setShowRejectInput(false);
                setRejectRemark("");
              }}
              disabled={isPending}
              className="px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <Section title="From Sales Order">
        <ReadOnly label="Work Order No" value={wo.workOrderNo} />
        <ReadOnly label="Date" value={fmtDate(wo.date)} />
        <ReadOnly label="Customer" value={wo.customer?.customerName} />
        <ReadOnly label="Internal Quotation No" value={wo.internalQuotationNo} />
        <ReadOnly label="Customer PO Ref" value={wo.customerPoRef} />
        <ReadOnly label="Project Code" value={wo.projectCode} />
        <ReadOnly label="Delivery Date" value={fmtDate(wo.deliveryDate)} />
        <ReadOnly label="Quantity" value={wo.quantity != null ? String(wo.quantity) : "-"} />
        <ReadOnly label="UOM" value={wo.uom} />
        <ReadOnly label="Amount" value={wo.amount != null ? Number(wo.amount).toFixed(2) : "-"} />
      </Section>

      <div>
        <label className="text-sm font-medium text-slate-700">Job Description</label>
        <div className="mt-1.5 px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-700">
          {wo.jobDescription || "-"}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Remark</label>
        <div className="mt-1.5 px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-700 whitespace-pre-wrap min-h-[38px]">
          {wo.remark || "-"}
        </div>
      </div>

      <Section title="Delivery Label">
        <ReadOnly label="Label Expiry Date" value={fmtDate(wo.labelExpiryDate)} />
        <ReadOnly label="Label Qty" value={wo.labelQty != null ? String(wo.labelQty) : "-"} />
        <ReadOnly label="Label UOM" value={wo.labelUom?.uomName || "-"} />
      </Section>

      <Section title="Quality Control (from QC Approval)">
        <ReadOnly label="QC Acceptance" value={wo.qcAcceptance ?? "N/A"} />
        <ReadOnly label="QC By" value={wo.qcBy?.name ?? "-"} />
        <ReadOnly label="QC Date" value={fmtDate(wo.qcDate)} />
      </Section>

      <div>
        <label className="text-sm font-medium text-slate-700">Upload File (URL)</label>
        <div className="mt-1.5 px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-700 truncate min-h-[38px]">
          {wo.uploadUrl ? (
            <a href={wo.uploadUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              {wo.uploadUrl}
            </a>
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
  );
}

function fmtDate(d?: string | Date | null) {
  if (!d) return "-";
  const iso = typeof d === "string" ? d : new Date(d).toISOString();
  const [y, m, day] = iso.slice(0, 10).split("-");
  return `${day}/${m}/${y}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <div className="mt-1 px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-700 min-h-[38px]">
        {value || "-"}
      </div>
    </div>
  );
}
