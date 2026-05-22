"use client";

import React, { useState, useEffect, useTransition, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSupplierDetail,
  updateSupplierRemarks,
  addContactPerson,
  updateContactPerson,
  toggleContactPersonStatus,
  setContactPersonDefault,
  deleteContactPerson,
  addAddress,
  updateAddress,
  toggleAddressStatus,
  setAddressDefault,
  deleteAddress,
} from "../actions";

interface ContactPerson {
  id: string;
  supplierId: string;
  contactPersonName: string;
  telNo: string | null;
  mobileNo: string | null;
  faxNo: string | null;
  email: string | null;
  designation: string | null;
  status: string;
  isDefault: boolean;
}

interface SupplierAddress {
  id: string;
  supplierId: string;
  address: string;
  status: string;
  isDefault: boolean;
}

interface SupplierFullDetail {
  id: string;
  supplierCode: string;
  supplierName: string;
  remarks: string | null;
  status: string;
  contactPersons: ContactPerson[];
  addresses: SupplierAddress[];
}

export default function ManageSupplierProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [supplierDetail, setSupplierDetail] = useState<SupplierFullDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"general" | "contacts" | "addresses">("general");

  const [remarksEdit, setRemarksEdit] = useState("");
  const [remarksSuccess, setRemarksSuccess] = useState(false);

  // Manage Contacts Sub-states
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactEditId, setContactEditId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactTel, setContactTel] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [contactFax, setContactFax] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactDesignation, setContactDesignation] = useState("");
  const [contactIsDefault, setContactIsDefault] = useState(false);
  const [contactFormError, setContactFormError] = useState<string | null>(null);

  // Manage Addresses Sub-states
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addressEditId, setAddressEditId] = useState<string | null>(null);
  const [addressText, setAddressText] = useState("");
  const [addressIsDefault, setAddressIsDefault] = useState(false);
  const [addressFormError, setAddressFormError] = useState<string | null>(null);

  useEffect(() => {
    loadSupplierDetail();
  }, [id]);

  const loadSupplierDetail = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const res = await getSupplierDetail(id);
    if (res.success && res.data) {
      setSupplierDetail(res.data as SupplierFullDetail);
      setRemarksEdit(res.data.remarks || "");
    } else {
      setErrorMsg(res.error || "Failed to load supplier details.");
    }
    setIsLoading(false);
  };

  const handleSaveRemarks = async () => {
    setRemarksSuccess(false);
    startTransition(async () => {
      const res = await updateSupplierRemarks(id, remarksEdit);
      if (res.success) {
        setRemarksSuccess(true);
        loadSupplierDetail();
      } else {
        alert(res.error || "Failed to update remarks.");
      }
    });
  };

  // CONTACT HANDLERS
  const handleOpenAddContact = () => {
    setContactEditId(null);
    setContactName("");
    setContactTel("");
    setContactMobile("");
    setContactFax("");
    setContactEmail("");
    setContactDesignation("");
    setContactIsDefault(false);
    setContactFormError(null);
    setIsContactFormOpen(true);
  };

  const handleOpenEditContact = (c: ContactPerson) => {
    setContactEditId(c.id);
    setContactName(c.contactPersonName);
    setContactTel(c.telNo || "");
    setContactMobile(c.mobileNo || "");
    setContactFax(c.faxNo || "");
    setContactEmail(c.email || "");
    setContactDesignation(c.designation || "");
    setContactIsDefault(c.isDefault);
    setContactFormError(null);
    setIsContactFormOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormError(null);
    const name = contactName.trim();
    if (!name) {
      setContactFormError("Contact Person name is required.");
      return;
    }
    startTransition(async () => {
      let res;
      if (contactEditId) {
        res = await updateContactPerson(contactEditId, {
          contactPersonName: name,
          telNo: contactTel,
          mobileNo: contactMobile,
          faxNo: contactFax,
          email: contactEmail,
          designation: contactDesignation,
        });
      } else {
        res = await addContactPerson(id, {
          contactPersonName: name,
          telNo: contactTel,
          mobileNo: contactMobile,
          faxNo: contactFax,
          email: contactEmail,
          designation: contactDesignation,
          isDefault: contactIsDefault,
        });
      }
      if (res.success) {
        setIsContactFormOpen(false);
        loadSupplierDetail();
      } else {
        setContactFormError(res.error || "Failed to save contact person.");
      }
    });
  };

  const handleToggleContactStatus = async (contactId: string) => {
    startTransition(async () => {
      const res = await toggleContactPersonStatus(contactId);
      if (res.success) {
        loadSupplierDetail();
      } else {
        alert(res.error || "Failed to toggle contact status.");
      }
    });
  };

  const handleSetContactDefault = async (contactId: string) => {
    startTransition(async () => {
      const res = await setContactPersonDefault(contactId, id);
      if (res.success) {
        loadSupplierDetail();
      } else {
        alert(res.error || "Failed to set default contact.");
      }
    });
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm("Are you sure you want to delete this contact person?")) {
      startTransition(async () => {
        const res = await deleteContactPerson(contactId);
        if (res.success) {
          loadSupplierDetail();
        } else {
          alert(res.error || "Failed to delete contact.");
        }
      });
    }
  };

  // ADDRESS HANDLERS
  const handleOpenAddAddress = () => {
    setAddressEditId(null);
    setAddressText("");
    setAddressIsDefault(false);
    setAddressFormError(null);
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (a: SupplierAddress) => {
    setAddressEditId(a.id);
    setAddressText(a.address);
    setAddressIsDefault(a.isDefault);
    setAddressFormError(null);
    setIsAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError(null);
    const txt = addressText.trim();
    if (!txt) {
      setAddressFormError("Address is required.");
      return;
    }
    startTransition(async () => {
      let res;
      if (addressEditId) {
        res = await updateAddress(addressEditId, txt);
      } else {
        res = await addAddress(id, { address: txt, isDefault: addressIsDefault });
      }
      if (res.success) {
        setIsAddressFormOpen(false);
        loadSupplierDetail();
      } else {
        setAddressFormError(res.error || "Failed to save address.");
      }
    });
  };

  const handleToggleAddressStatus = async (addressId: string) => {
    startTransition(async () => {
      const res = await toggleAddressStatus(addressId);
      if (res.success) {
        loadSupplierDetail();
      } else {
        alert(res.error || "Failed to toggle address status.");
      }
    });
  };

  const handleSetAddressDefault = async (addressId: string) => {
    startTransition(async () => {
      const res = await setAddressDefault(addressId, id);
      if (res.success) {
        loadSupplierDetail();
      } else {
        alert(res.error || "Failed to set default address.");
      }
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      startTransition(async () => {
        const res = await deleteAddress(addressId);
        if (res.success) {
          loadSupplierDetail();
        } else {
          alert(res.error || "Failed to delete address.");
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  if (errorMsg || !supplierDetail) {
    return (
      <div className="p-6 text-center bg-white text-black">
        <p className="text-lg font-bold text-red-600">Error Loading Profile</p>
        <p className="text-sm text-zinc-600 mt-2">{errorMsg || "Supplier detail not found."}</p>
        <Link
          href="/dashboard/admin/master-profile/supplier"
          className="mt-4 inline-flex items-center gap-2 rounded-lg glossy-button-white px-4 py-2 text-sm text-zinc-800"
        >
          ← Back to Suppliers List
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-black space-y-6">
      {/* Header / Navigation */}
      <div className="space-y-2">
        <Link
          href="/dashboard/admin/master-profile/supplier"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors"
        >
          ← Back to Suppliers List
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-2.5">
              <span>Manage Supplier Profile</span>
              <span className="text-sm bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-650 font-bold">
                {supplierDetail.supplierCode}
              </span>
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              {supplierDetail.supplierName}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-200">
        {[
          { id: "general", label: "General Info" },
          { id: "contacts", label: `Contact Persons (${supplierDetail.contactPersons.length})` },
          { id: "addresses", label: `Addresses (${supplierDetail.addresses.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setDetailTab(t.id as any);
              setIsContactFormOpen(false);
              setIsAddressFormOpen(false);
              setRemarksSuccess(false);
            }}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              detailTab === t.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="pt-2">
        {/* TAB 1: GENERAL INFO */}
        {detailTab === "general" && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-zinc-600 uppercase tracking-wide">Supplier Code</span>
                <input
                  type="text"
                  disabled
                  value={supplierDetail.supplierCode}
                  className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 text-base text-zinc-500 font-medium cursor-not-allowed select-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-zinc-600 uppercase tracking-wide">Supplier Name</span>
                <input
                  type="text"
                  disabled
                  value={supplierDetail.supplierName}
                  className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 text-base text-zinc-500 font-medium cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-zinc-800">Remarks</label>
              <textarea
                rows={5}
                placeholder="Enter remarks..."
                value={remarksEdit}
                onChange={(e) => setRemarksEdit(e.target.value)}
                className="rounded-lg glossy-input px-3 py-2 text-base outline-hidden resize-none w-full"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleSaveRemarks}
                disabled={isPending}
                className="rounded-lg glossy-button-blue px-5 py-2.5 text-base font-bold text-white shadow-xs cursor-pointer disabled:opacity-75"
              >
                {isPending ? "Saving..." : "Save Remarks"}
              </button>
              {remarksSuccess && (
                <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                  ✓ Saved successfully
                </span>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT PERSONS */}
        {detailTab === "contacts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-black">Contact Persons</h3>
              {!isContactFormOpen && (
                <button
                  onClick={handleOpenAddContact}
                  className="rounded-lg glossy-button-blue px-4 py-2.5 text-sm font-bold text-white shadow-xs cursor-pointer"
                >
                  Add Contact Person
                </button>
              )}
            </div>

            {isContactFormOpen && (
              <form
                onSubmit={handleContactSubmit}
                className="border border-blue-100 bg-blue-50/10 p-5 rounded-xl space-y-5"
              >
                <h4 className="text-sm font-bold uppercase tracking-wider text-blue-700">
                  {contactEditId ? "Edit Contact Details" : "Add New Contact"}
                </h4>
                {contactFormError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                    {contactFormError}
                  </div>
                )}
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-700">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-700">Tel No</label>
                    <input
                      type="text"
                      value={contactTel}
                      onChange={(e) => setContactTel(e.target.value)}
                      className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-700">Mobile No</label>
                    <input
                      type="text"
                      value={contactMobile}
                      onChange={(e) => setContactMobile(e.target.value)}
                      className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                    />
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-700">Fax No</label>
                    <input
                      type="text"
                      value={contactFax}
                      onChange={(e) => setContactFax(e.target.value)}
                      className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-700">Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-700">Designation</label>
                    <input
                      type="text"
                      value={contactDesignation}
                      onChange={(e) => setContactDesignation(e.target.value)}
                      className="rounded-lg glossy-input px-3 py-2 text-sm w-full"
                    />
                  </div>
                </div>
                {!contactEditId && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="supplierContactDefault"
                      checked={contactIsDefault}
                      onChange={(e) => setContactIsDefault(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-zinc-300 text-blue-600"
                    />
                    <label
                      htmlFor="supplierContactDefault"
                      className="text-sm font-semibold text-zinc-800"
                    >
                      Set as Default Contact Person
                    </label>
                  </div>
                )}
                <div className="flex items-center gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContactFormOpen(false)}
                    className="rounded-lg glossy-button-white px-4 py-2 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg glossy-button-blue px-4 py-2 text-sm text-white cursor-pointer"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            {supplierDetail.contactPersons.length === 0 ? (
              <div className="text-center py-10 text-sm text-zinc-500 border border-dashed border-zinc-200 rounded-lg">
                No contact persons added yet. Click "Add Contact Person" above.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 font-bold uppercase tracking-wider text-zinc-700">
                        <th className="px-5 py-3.5">Contact Person</th>
                        <th className="px-5 py-3.5">Tel No</th>
                        <th className="px-5 py-3.5">Mobile No</th>
                        <th className="px-5 py-3.5">Fax No</th>
                        <th className="px-5 py-3.5">Email</th>
                        <th className="px-5 py-3.5">Designation</th>
                        <th className="px-5 py-3.5 text-center">Default</th>
                        <th className="px-5 py-3.5 text-center">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {supplierDetail.contactPersons.map((contact) => (
                        <tr key={contact.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-black">{contact.contactPersonName}</td>
                          <td className="px-5 py-3.5 text-zinc-800">{contact.telNo || "—"}</td>
                          <td className="px-5 py-3.5 text-zinc-800">{contact.mobileNo || "—"}</td>
                          <td className="px-5 py-3.5 text-zinc-800">{contact.faxNo || "—"}</td>
                          <td className="px-5 py-3.5 text-zinc-800">{contact.email || "—"}</td>
                          <td className="px-5 py-3.5 text-zinc-800">{contact.designation || "—"}</td>
                          <td className="px-5 py-3.5 text-center">
                            {contact.isDefault ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                                Default
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSetContactDefault(contact.id)}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-500 cursor-pointer"
                              >
                                Set Default
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                contact.status === "Active"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-zinc-50 text-zinc-600 border-zinc-200"
                              }`}
                            >
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditContact(contact)}
                                className="rounded-md glossy-button-white px-2 py-1 text-[10px] cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleContactStatus(contact.id)}
                                className={`rounded-md px-2 py-1 text-[10px] font-bold border transition-colors cursor-pointer ${
                                  contact.status === "Active"
                                    ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                    : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                                }`}
                              >
                                {contact.status === "Active" ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
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
        )}

        {/* TAB 3: ADDRESSES */}
        {detailTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-black">Addresses</h3>
              {!isAddressFormOpen && (
                <button
                  onClick={handleOpenAddAddress}
                  className="rounded-lg glossy-button-blue px-4 py-2.5 text-sm font-bold text-white shadow-xs cursor-pointer"
                >
                  Add Address
                </button>
              )}
            </div>

            {isAddressFormOpen && (
              <form
                onSubmit={handleAddressSubmit}
                className="border border-blue-100 bg-blue-50/10 p-5 rounded-xl space-y-5"
              >
                <h4 className="text-sm font-bold uppercase tracking-wider text-blue-700">
                  {addressEditId ? "Edit Address" : "Add New Address"}
                </h4>
                {addressFormError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                    {addressFormError}
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    className="rounded-lg glossy-input px-3 py-2 text-sm resize-none w-full"
                    placeholder="Enter full address..."
                  />
                </div>
                {!addressEditId && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="supplierAddressDefault"
                      checked={addressIsDefault}
                      onChange={(e) => setAddressIsDefault(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-zinc-300 text-blue-600"
                    />
                    <label
                      htmlFor="supplierAddressDefault"
                      className="text-sm font-semibold text-zinc-800"
                    >
                      Set as Default Address
                    </label>
                  </div>
                )}
                <div className="flex items-center gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(false)}
                    className="rounded-lg glossy-button-white px-4 py-2 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg glossy-button-blue px-4 py-2 text-sm text-white cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {supplierDetail.addresses.length === 0 ? (
              <div className="text-center py-10 text-sm text-zinc-550 border border-dashed border-zinc-200 rounded-lg">
                No addresses added yet. Click "Add Address" above.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 font-bold uppercase tracking-wider text-zinc-700">
                        <th className="px-5 py-3.5">Address</th>
                        <th className="px-5 py-3.5 text-center">Default</th>
                        <th className="px-5 py-3.5 text-center">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {supplierDetail.addresses.map((addr) => (
                        <tr key={addr.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-5 py-3.5 text-zinc-800 whitespace-pre-wrap max-w-xl">{addr.address}</td>
                          <td className="px-5 py-3.5 text-center">
                            {addr.isDefault ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                                Default
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSetAddressDefault(addr.id)}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-500 cursor-pointer"
                              >
                                Set Default
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                addr.status === "Active"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-zinc-50 text-zinc-600 border-zinc-200"
                              }`}
                            >
                              {addr.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditAddress(addr)}
                                className="rounded-md glossy-button-white px-2 py-1 text-[10px] cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleAddressStatus(addr.id)}
                                className={`rounded-md px-2 py-1 text-[10px] font-bold border transition-colors cursor-pointer ${
                                  addr.status === "Active"
                                    ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                    : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                                }`}
                              >
                                {addr.status === "Active" ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
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
        )}
      </div>
    </div>
  );
}
