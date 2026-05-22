"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupplierProfileWithDetails } from "../actions";

export default function CreateSupplierProfilePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State variables for form fields
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Contact Person section state
  const [createContactName, setCreateContactName] = useState("");
  const [createContactTel, setCreateContactTel] = useState("");
  const [createContactMobile, setCreateContactMobile] = useState("");
  const [createContactFax, setCreateContactFax] = useState("");
  const [createContactEmail, setCreateContactEmail] = useState("");
  const [createContactDesignation, setCreateContactDesignation] = useState("");

  // Address section state
  const [createAddress, setCreateAddress] = useState("");

  const handleCancel = () => {
    router.push("/dashboard/admin/master-profile/supplier");
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const code = newCode.trim();
    const name = newName.trim();

    if (!code) {
      setFormError("Supplier Code is required.");
      return;
    }
    if (!name) {
      setFormError("Supplier Name is required.");
      return;
    }

    const contactData = createContactName.trim()
      ? {
          contactPersonName: createContactName.trim(),
          telNo: createContactTel.trim() || undefined,
          mobileNo: createContactMobile.trim() || undefined,
          faxNo: createContactFax.trim() || undefined,
          email: createContactEmail.trim() || undefined,
          designation: createContactDesignation.trim() || undefined,
        }
      : undefined;

    const addressData = createAddress.trim()
      ? {
          address: createAddress.trim(),
        }
      : undefined;

    startTransition(async () => {
      const res = await createSupplierProfileWithDetails(
        { supplierCode: code, supplierName: name, remarks: newRemarks.trim() || undefined },
        contactData,
        addressData
      );

      if (res.success) {
        router.push("/dashboard/admin/master-profile/supplier");
      } else {
        setFormError(res.error || "Failed to create supplier.");
      }
    });
  };

  return (
    <div className="w-full bg-white text-black space-y-6">
      {/* Page Header / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Create Supplier Profile</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Add a new supplier to the system. You can optionally include their contact person and address.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateSupplier} className="flex flex-col space-y-8">
        {formError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-800 font-medium">
            {formError}
          </div>
        )}

        {/* Form Body Split-pane */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* LEFT COLUMN: Supplier Profile (Section 1) */}
          <div className="flex flex-col gap-4 md:w-1/2 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </span>
              <h3 className="text-base font-bold text-black">Supplier Profile</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-700">
                Supplier Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SUP001"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="rounded-lg glossy-input px-3 py-2 text-base outline-hidden w-full"
              />
              <p className="text-xs text-zinc-500">Once saved, cannot be changed. Must be unique.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-700">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ABC Supplies Pte Ltd"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-lg glossy-input px-3 py-2 text-base outline-hidden w-full"
              />
              <p className="text-xs text-zinc-500">Once saved, cannot be changed. Must be unique.</p>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-h-[180px]">
              <label className="text-sm font-bold text-zinc-700">Remarks</label>
              <textarea
                placeholder="Enter remarks..."
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
                className="rounded-lg glossy-input px-3 py-2 text-base outline-hidden resize-none w-full flex-1"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Person + Address (Sections 2 & 3) */}
          <div className="flex flex-col gap-8 flex-1">
            {/* SECTION 2: Contact Person */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  2
                </span>
                <h3 className="text-base font-bold text-black">Contact Person</h3>
                <span className="text-xs text-zinc-500">(optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-700">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={createContactName}
                    onChange={(e) => setCreateContactName(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-700">Tel No</label>
                  <input
                    type="text"
                    placeholder="Telephone"
                    value={createContactTel}
                    onChange={(e) => setCreateContactTel(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-700">Mobile No</label>
                  <input
                    type="text"
                    placeholder="Mobile"
                    value={createContactMobile}
                    onChange={(e) => setCreateContactMobile(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-700">Fax No</label>
                  <input
                    type="text"
                    placeholder="Fax"
                    value={createContactFax}
                    onChange={(e) => setCreateContactFax(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-700">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={createContactEmail}
                    onChange={(e) => setCreateContactEmail(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-700">Designation</label>
                  <input
                    type="text"
                    placeholder="Job title"
                    value={createContactDesignation}
                    onChange={(e) => setCreateContactDesignation(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Address */}
            <div className="flex flex-col gap-3 flex-1 min-h-[140px]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  3
                </span>
                <h3 className="text-base font-bold text-black">Address</h3>
                <span className="text-xs text-zinc-500">(optional)</span>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-bold text-zinc-700">Address</label>
                <textarea
                  placeholder="Enter full address..."
                  value={createAddress}
                  onChange={(e) => setCreateAddress(e.target.value)}
                  className="rounded-lg glossy-input px-3 py-2 text-sm resize-none w-full flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg glossy-button-white px-5 py-2.5 text-base font-bold text-zinc-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg glossy-button-blue px-5 py-2.5 text-base font-bold text-white shadow-xs disabled:opacity-75 cursor-pointer min-w-[90px]"
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
