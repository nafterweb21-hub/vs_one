"use client";

import React, { useState } from "react";
import { checkCocAction, approveCocAction, removeCoc } from "../actions";
import { useRouter } from "next/navigation";

export default function CocActionButtons({ cocId, status }: { cocId: string; status: string }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCheck = async () => {
    setIsChecking(true);
    const res = await checkCocAction(cocId);
    if (!res.success) {
      alert(res.error);
    }
    setIsChecking(false);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    const res = await approveCocAction(cocId);
    if (!res.success) {
      alert(res.error);
    }
    setIsApproving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this COC?")) return;
    setIsDeleting(true);
    const res = await removeCoc(cocId);
    if (res.success) {
      router.push("/dashboard/qc/coc");
    } else {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status === "Draft" && (
        <>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-200 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500 transition-colors shadow-sm disabled:opacity-50"
          >
            {isChecking ? "Checking..." : "Check"}
          </button>
        </>
      )}

      {status === "Require Approval" && (
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500 transition-colors shadow-sm disabled:opacity-50"
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
      )}

      <button
        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
        onClick={() => alert("Print layout to be implemented.")}
      >
        Print
      </button>
    </div>
  );
}
