"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getSupplierProfiles,
  getSupplierDetail,
  createSupplierProfileWithDetails,
  updateSupplierRemarks,
  toggleSupplierStatus,
  deleteSupplierProfile,
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
  SupplierProfileInput,
  ContactPersonInput,
  AddressInput,
} from "./actions";

interface SupplierSummary {
  id: string;
  supplierCode: string;
  supplierName: string;
  remarks: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    contactPersons: number;
    addresses: number;
  };
}

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

export default function SupplierProfilePage() {
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierDetail, setSupplierDetail] = useState<SupplierFullDetail | null>(null);
  const [detailTab, setDetailTab] = useState<"general" | "contacts" | "addresses">("general");

  // Create form - Supplier Info
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Create form - Contact Person section
  const [createContactName, setCreateContactName] = useState("");
  const [createContactTel, setCreateContactTel] = useState("");
  const [createContactMobile, setCreateContactMobile] = useState("");
  const [createContactFax, setCreateContactFax] = useState("");
  const [createContactEmail, setCreateContactEmail] = useState("");
  const [createContactDesignation, setCreateContactDesignation] = useState("");

  // Create form - Address section
  const [createAddress, setCreateAddress] = useState("");

  const [remarksEdit, setRemarksEdit] = useState("");
  const [remarksSuccess, setRemarksSuccess] = useState(false);

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

  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addressEditId, setAddressEditId] = useState<string | null>(null);
  const [addressText, setAddressText] = useState("");
  const [addressIsDefault, setAddressIsDefault] = useState(false);
  const [addressFormError, setAddressFormError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => { loadSuppliers(); }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await getSupplierProfiles();
    if (result.success && result.data) {
      setSuppliers(result.data as any[]);
    } else {
      setErrorMsg(result.error || "Failed to load supplier profiles.");
    }
    setIsLoading(false);
  };

  const loadSupplierDetailData = async (id: string) => {
    const res = await getSupplierDetail(id);
    if (res.success && res.data) {
      setSupplierDetail(res.data as SupplierFullDetail);
      setRemarksEdit(res.data.remarks || "");
    } else {
      alert(res.error || "Failed to load supplier details.");
    }
  };

  const handleOpenCreateModal = () => {
    setNewCode(""); setNewName(""); setNewRemarks(""); setFormError(null);
    setCreateContactName(""); setCreateContactTel(""); setCreateContactMobile("");
    setCreateContactFax(""); setCreateContactEmail(""); setCreateContactDesignation("");
    setCreateAddress("");
    setIsCreateModalOpen(true);
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const code = newCode.trim();
    const name = newName.trim();
    if (!code) { setFormError("Supplier Code is required."); return; }
    if (!name) { setFormError("Supplier Name is required."); return; }

    const contactData = createContactName.trim() ? {
      contactPersonName: createContactName.trim(),
      telNo: createContactTel,
      mobileNo: createContactMobile,
      faxNo: createContactFax,
      email: createContactEmail,
      designation: createContactDesignation,
    } : undefined;

    const addressData = createAddress.trim() ? {
      address: createAddress.trim(),
    } : undefined;

    startTransition(async () => {
      const res = await createSupplierProfileWithDetails(
        { supplierCode: code, supplierName: name, remarks: newRemarks },
        contactData,
        addressData
      );
      if (res.success) { setIsCreateModalOpen(false); loadSuppliers(); }
      else { setFormError(res.error || "Failed to create supplier."); }
    });
  };

  const handleOpenManageModal = async (id: string) => {
    setSelectedSupplierId(id);
    setDetailTab("general");
    setIsContactFormOpen(false);
    setIsAddressFormOpen(false);
    setRemarksSuccess(false);
    setIsManageModalOpen(true);
    await loadSupplierDetailData(id);
  };

  const handleSaveRemarks = async () => {
    if (!selectedSupplierId) return;
    setRemarksSuccess(false);
    startTransition(async () => {
      const res = await updateSupplierRemarks(selectedSupplierId, remarksEdit);
      if (res.success) { setRemarksSuccess(true); loadSuppliers(); }
      else { alert(res.error || "Failed to update remarks."); }
    });
  };

  const handleToggleSupplierStatus = async (id: string) => {
    startTransition(async () => {
      const res = await toggleSupplierStatus(id);
      if (res.success) loadSuppliers();
      else alert(res.error || "Failed to change status.");
    });
  };

  const handleDeleteSupplier = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this supplier? This will also delete all associated addresses and contact persons.")) {
      startTransition(async () => {
        const res = await deleteSupplierProfile(id);
        if (res.success) loadSuppliers();
        else alert(res.error || "Failed to delete supplier.");
      });
    }
  };

  // CONTACT HANDLERS
  const handleOpenAddContact = () => {
    setContactEditId(null); setContactName(""); setContactTel(""); setContactMobile("");
    setContactFax(""); setContactEmail(""); setContactDesignation(""); setContactIsDefault(false);
    setContactFormError(null); setIsContactFormOpen(true);
  };

  const handleOpenEditContact = (c: ContactPerson) => {
    setContactEditId(c.id); setContactName(c.contactPersonName);
    setContactTel(c.telNo || ""); setContactMobile(c.mobileNo || "");
    setContactFax(c.faxNo || ""); setContactEmail(c.email || "");
    setContactDesignation(c.designation || ""); setContactIsDefault(c.isDefault);
    setContactFormError(null); setIsContactFormOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) return;
    setContactFormError(null);
    const name = contactName.trim();
    if (!name) { setContactFormError("Contact Person name is required."); return; }
    startTransition(async () => {
      let res;
      if (contactEditId) {
        res = await updateContactPerson(contactEditId, {
          contactPersonName: name, telNo: contactTel, mobileNo: contactMobile,
          faxNo: contactFax, email: contactEmail, designation: contactDesignation,
        });
      } else {
        res = await addContactPerson(selectedSupplierId, {
          contactPersonName: name, telNo: contactTel, mobileNo: contactMobile,
          faxNo: contactFax, email: contactEmail, designation: contactDesignation,
          isDefault: contactIsDefault,
        });
      }
      if (res.success) { setIsContactFormOpen(false); loadSupplierDetailData(selectedSupplierId); loadSuppliers(); }
      else { setContactFormError(res.error || "Failed to save contact person."); }
    });
  };

  const handleToggleContactStatus = async (id: string) => {
    if (!selectedSupplierId) return;
    startTransition(async () => {
      const res = await toggleContactPersonStatus(id);
      if (res.success) loadSupplierDetailData(selectedSupplierId);
      else alert(res.error || "Failed to toggle contact status.");
    });
  };

  const handleSetContactDefault = async (id: string) => {
    if (!selectedSupplierId) return;
    startTransition(async () => {
      const res = await setContactPersonDefault(id, selectedSupplierId);
      if (res.success) loadSupplierDetailData(selectedSupplierId);
      else alert(res.error || "Failed to set default contact.");
    });
  };

  const handleDeleteContact = async (id: string) => {
    if (!selectedSupplierId) return;
    if (window.confirm("Are you sure you want to delete this contact person?")) {
      startTransition(async () => {
        const res = await deleteContactPerson(id);
        if (res.success) { loadSupplierDetailData(selectedSupplierId); loadSuppliers(); }
        else alert(res.error || "Failed to delete contact.");
      });
    }
  };

  // ADDRESS HANDLERS
  const handleOpenAddAddress = () => {
    setAddressEditId(null); setAddressText(""); setAddressIsDefault(false);
    setAddressFormError(null); setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (a: SupplierAddress) => {
    setAddressEditId(a.id); setAddressText(a.address);
    setAddressIsDefault(a.isDefault); setAddressFormError(null); setIsAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) return;
    setAddressFormError(null);
    const txt = addressText.trim();
    if (!txt) { setAddressFormError("Address is required."); return; }
    startTransition(async () => {
      let res;
      if (addressEditId) { res = await updateAddress(addressEditId, txt); }
      else { res = await addAddress(selectedSupplierId, { address: txt, isDefault: addressIsDefault }); }
      if (res.success) { setIsAddressFormOpen(false); loadSupplierDetailData(selectedSupplierId); loadSuppliers(); }
      else { setAddressFormError(res.error || "Failed to save address."); }
    });
  };

  const handleToggleAddressStatus = async (id: string) => {
    if (!selectedSupplierId) return;
    startTransition(async () => {
      const res = await toggleAddressStatus(id);
      if (res.success) loadSupplierDetailData(selectedSupplierId);
      else alert(res.error || "Failed to toggle address status.");
    });
  };

  const handleSetAddressDefault = async (id: string) => {
    if (!selectedSupplierId) return;
    startTransition(async () => {
      const res = await setAddressDefault(id, selectedSupplierId);
      if (res.success) loadSupplierDetailData(selectedSupplierId);
      else alert(res.error || "Failed to set default address.");
    });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!selectedSupplierId) return;
    if (window.confirm("Are you sure you want to delete this address?")) {
      startTransition(async () => {
        const res = await deleteAddress(id);
        if (res.success) { loadSupplierDetailData(selectedSupplierId); loadSuppliers(); }
        else alert(res.error || "Failed to delete address.");
      });
    }
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.supplierCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 bg-white text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Supplier Profile</h1>
          <p className="text-sm text-zinc-600">
            Maintain the master list of suppliers along with their contact persons and addresses.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-lg glossy-button-blue px-4 py-2.5 text-sm font-bold text-white shadow-md cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl glossy-bg p-4 bg-white">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg glossy-input py-2 pl-10 pr-4 text-sm outline-hidden placeholder:text-zinc-500 bg-white"
          />
        </div>
      </div>

      {/* Supplier Table */}
      <div className="overflow-hidden rounded-xl glossy-bg bg-white">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
          </div>
        ) : errorMsg ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="font-semibold text-black">Error loading suppliers</p>
            <p className="text-sm text-zinc-600">{errorMsg}</p>
            <button onClick={loadSuppliers} className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-500 cursor-pointer">Try again</button>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
            <p className="mt-2 font-semibold text-black">No suppliers found</p>
            <p className="text-sm text-zinc-600">
              {searchQuery ? "No matches for your criteria." : "Create your first Supplier Profile to begin."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-700">
                  <th className="px-6 py-4 w-16">SN</th>
                  <th className="px-6 py-4">Supplier Code</th>
                  <th className="px-6 py-4">Supplier Name</th>
                  <th className="px-6 py-4 text-center">Contacts</th>
                  <th className="px-6 py-4 text-center">Addresses</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredSuppliers.map((supplier, index) => (
                  <tr key={supplier.id} className="group hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-zinc-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-bold text-black">{supplier.supplierCode}</td>
                    <td className="px-6 py-4 text-sm font-medium text-zinc-800">{supplier.supplierName}</td>
                    <td className="px-6 py-4 text-sm text-center text-zinc-800">{supplier._count.contactPersons}</td>
                    <td className="px-6 py-4 text-sm text-center text-zinc-800">{supplier._count.addresses}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        supplier.status === "Active"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${supplier.status === "Active" ? "bg-blue-600" : "bg-zinc-400"}`} />
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenManageModal(supplier.id)}
                          className="rounded-md glossy-button-blue px-2.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleToggleSupplierStatus(supplier.id)}
                          disabled={isPending}
                          className={`rounded-md px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                            supplier.status === "Active"
                              ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                              : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                          }`}
                        >
                          {supplier.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          disabled={isPending}
                          className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
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
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-xs" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-5xl transform rounded-xl bg-white shadow-xl border border-zinc-200 flex flex-col h-[88vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 flex-shrink-0">
              <h2 className="text-lg font-bold text-black">Create Supplier Profile</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="flex flex-col flex-1 overflow-hidden">
              {formError && (
                <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800 flex-shrink-0">{formError}</div>
              )}

              {/* 2-PANEL BODY */}
              <div className="flex flex-1 gap-0 overflow-hidden">

                {/* LEFT PANEL — Supplier Profile */}
                <div className="flex flex-col gap-3 border-r border-zinc-100 px-6 py-5 w-[42%] flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">1</span>
                    <h3 className="text-sm font-bold text-black">Supplier Profile</h3>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-zinc-700">Supplier Code <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. SUP001" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="rounded-lg glossy-input px-3 py-2 text-sm outline-hidden w-full" />
                    <p className="text-[10px] text-zinc-400">Once saved, cannot be changed. Must be unique.</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-zinc-700">Supplier Name <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. ABC Supplies Pte Ltd" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-lg glossy-input px-3 py-2 text-sm outline-hidden w-full" />
                    <p className="text-[10px] text-zinc-400">Once saved, cannot be changed. Must be unique.</p>
                  </div>

                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-bold text-zinc-700">Remarks</label>
                    <textarea placeholder="Enter remarks..." value={newRemarks} onChange={(e) => setNewRemarks(e.target.value)} className="rounded-lg glossy-input px-3 py-2 text-sm outline-hidden resize-none w-full flex-1" style={{minHeight: "80px"}} />
                  </div>
                </div>

                {/* RIGHT PANEL — Contact Person + Address */}
                <div className="flex flex-col gap-4 px-6 py-5 flex-1">

                  {/* Contact Person */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
                      <h3 className="text-sm font-bold text-black">Contact Person</h3>
                      <span className="text-[10px] text-zinc-400">(optional)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-bold text-zinc-600">Contact Person</label>
                        <input type="text" placeholder="Full name" value={createContactName} onChange={(e) => setCreateContactName(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-bold text-zinc-600">Tel No</label>
                        <input type="text" placeholder="Telephone" value={createContactTel} onChange={(e) => setCreateContactTel(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-bold text-zinc-600">Mobile No</label>
                        <input type="text" placeholder="Mobile" value={createContactMobile} onChange={(e) => setCreateContactMobile(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-bold text-zinc-600">Fax No</label>
                        <input type="text" placeholder="Fax" value={createContactFax} onChange={(e) => setCreateContactFax(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-bold text-zinc-600">Email</label>
                        <input type="email" placeholder="Email" value={createContactEmail} onChange={(e) => setCreateContactEmail(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-bold text-zinc-600">Designation</label>
                        <input type="text" placeholder="Job title" value={createContactDesignation} onChange={(e) => setCreateContactDesignation(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100" />

                  {/* Address */}
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">3</span>
                      <h3 className="text-sm font-bold text-black">Address</h3>
                      <span className="text-[10px] text-zinc-400">(optional)</span>
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <label className="text-[10px] font-bold text-zinc-600">Address</label>
                      <textarea placeholder="Enter full address..." value={createAddress} onChange={(e) => setCreateAddress(e.target.value)} className="rounded-md glossy-input px-2 py-1.5 text-xs resize-none w-full flex-1" style={{minHeight: "72px"}} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-3 flex-shrink-0">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-lg glossy-button-white px-4 py-2 text-sm font-bold text-zinc-800 cursor-pointer">Cancel</button>
                <button type="submit" disabled={isPending} className="inline-flex items-center justify-center rounded-lg glossy-button-blue px-4 py-2 text-sm font-bold text-white shadow-md disabled:opacity-70 cursor-pointer">
                  {isPending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Create"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MANAGE MODAL */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-xs" onClick={() => setIsManageModalOpen(false)} />
          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl border border-zinc-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>Manage Supplier Profile</span>
                  {supplierDetail && (
                    <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 text-zinc-600">
                      {supplierDetail.supplierCode}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">{supplierDetail?.supplierName}</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 mt-4">
              {[
                { id: "general", label: "General Info" },
                { id: "contacts", label: `Contact Persons (${supplierDetail?.contactPersons.length || 0})` },
                { id: "addresses", label: `Addresses (${supplierDetail?.addresses.length || 0})` },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setDetailTab(t.id as any); setIsContactFormOpen(false); setIsAddressFormOpen(false); }}
                  className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    detailTab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto py-5 space-y-4 min-h-[40vh]">
              {!supplierDetail ? (
                <div className="flex h-36 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
                </div>
              ) : (
                <>
                  {/* TAB 1: GENERAL INFO */}
                  {detailTab === "general" && (
                    <div className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-zinc-500 uppercase">Supplier Code</span>
                          <span className="text-sm font-bold text-black bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg">{supplierDetail.supplierCode}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-zinc-500 uppercase">Supplier Name</span>
                          <span className="text-sm font-bold text-black bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg">{supplierDetail.supplierName}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-zinc-800">Remarks</label>
                        <textarea rows={4} placeholder="Enter remarks..." value={remarksEdit} onChange={(e) => setRemarksEdit(e.target.value)} className="rounded-lg glossy-input px-3 py-2 text-sm outline-hidden resize-none" />
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={handleSaveRemarks} disabled={isPending} className="rounded-lg glossy-button-blue px-4 py-2 text-sm font-bold text-white shadow-md cursor-pointer">
                          Save Remarks
                        </button>
                        {remarksSuccess && <span className="text-sm text-green-600 font-semibold">✓ Saved successfully</span>}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CONTACT PERSONS */}
                  {detailTab === "contacts" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-black">Contact Persons list</h3>
                        {!isContactFormOpen && (
                          <button onClick={handleOpenAddContact} className="rounded-lg glossy-button-blue px-3 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer">
                            Add Contact Person
                          </button>
                        )}
                      </div>

                      {isContactFormOpen && (
                        <form onSubmit={handleContactSubmit} className="border border-blue-200 bg-blue-50/20 p-4 rounded-xl space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                            {contactEditId ? "Edit Contact Details" : "Add New Contact"}
                          </h4>
                          {contactFormError && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-2.5 text-xs text-red-800">{contactFormError}</div>
                          )}
                          {/* Row 1: Contact Person, Tel No, Mobile No */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-zinc-700">Contact Person <span className="text-red-500">*</span></label>
                              <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-zinc-700">Tel No</label>
                              <input type="text" value={contactTel} onChange={(e) => setContactTel(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-zinc-700">Mobile No</label>
                              <input type="text" value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs" />
                            </div>
                          </div>
                          {/* Row 2: Fax No, Email, Designation */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-zinc-700">Fax No</label>
                              <input type="text" value={contactFax} onChange={(e) => setContactFax(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-zinc-700">Email</label>
                              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-zinc-700">Designation</label>
                              <input type="text" value={contactDesignation} onChange={(e) => setContactDesignation(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs" />
                            </div>
                          </div>
                          {!contactEditId && (
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="supplierContactDefault" checked={contactIsDefault} onChange={(e) => setContactIsDefault(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-blue-600" />
                              <label htmlFor="supplierContactDefault" className="text-xs font-bold text-zinc-800">Set as Default Contact Person</label>
                            </div>
                          )}
                          <div className="flex items-center gap-2 justify-end">
                            <button type="button" onClick={() => setIsContactFormOpen(false)} className="rounded-lg glossy-button-white px-3 py-1.5 text-xs cursor-pointer">Cancel</button>
                            <button type="submit" disabled={isPending} className="rounded-lg glossy-button-blue px-3 py-1.5 text-xs text-white cursor-pointer">Save Contact</button>
                          </div>
                        </form>
                      )}

                      {supplierDetail.contactPersons.length === 0 ? (
                        <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-zinc-200 rounded-lg">
                          No contact persons added yet. Click "Add Contact Person" above.
                        </div>
                      ) : (
                        <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-zinc-200 bg-zinc-50 font-bold text-zinc-700">
                                <th className="px-4 py-3">Contact Person</th>
                                <th className="px-4 py-3">Tel No</th>
                                <th className="px-4 py-3">Mobile No</th>
                                <th className="px-4 py-3">Fax No</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Designation</th>
                                <th className="px-4 py-3 text-center">Default</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                              {supplierDetail.contactPersons.map((contact) => (
                                <tr key={contact.id} className="hover:bg-zinc-50">
                                  <td className="px-4 py-3 font-bold text-black">{contact.contactPersonName}</td>
                                  <td className="px-4 py-3 text-zinc-800">{contact.telNo || "—"}</td>
                                  <td className="px-4 py-3 text-zinc-800">{contact.mobileNo || "—"}</td>
                                  <td className="px-4 py-3 text-zinc-800">{contact.faxNo || "—"}</td>
                                  <td className="px-4 py-3 text-zinc-800">{contact.email || "—"}</td>
                                  <td className="px-4 py-3 text-zinc-800">{contact.designation || "—"}</td>
                                  <td className="px-4 py-3 text-center">
                                    {contact.isDefault ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">Default</span>
                                    ) : (
                                      <button onClick={() => handleSetContactDefault(contact.id)} className="text-[10px] font-bold text-blue-600 hover:text-blue-500 cursor-pointer">Set Default</button>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                      contact.status === "Active" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                                    }`}>{contact.status}</span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button onClick={() => handleOpenEditContact(contact)} className="rounded-md glossy-button-white px-2 py-1 text-[10px] cursor-pointer">Edit</button>
                                      <button onClick={() => handleToggleContactStatus(contact.id)} className={`rounded-md px-2 py-1 text-[10px] font-bold border cursor-pointer ${
                                        contact.status === "Active" ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700" : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                                      }`}>{contact.status === "Active" ? "Deactivate" : "Activate"}</button>
                                      <button onClick={() => handleDeleteContact(contact.id)} className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100 cursor-pointer">Delete</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: ADDRESSES */}
                  {detailTab === "addresses" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-black">Addresses list</h3>
                        {!isAddressFormOpen && (
                          <button onClick={handleOpenAddAddress} className="rounded-lg glossy-button-blue px-3 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer">Add Address</button>
                        )}
                      </div>

                      {isAddressFormOpen && (
                        <form onSubmit={handleAddressSubmit} className="border border-blue-200 bg-blue-50/20 p-4 rounded-xl space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                            {addressEditId ? "Edit Address" : "Add New Address"}
                          </h4>
                          {addressFormError && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-2.5 text-xs text-red-800">{addressFormError}</div>
                          )}
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-zinc-700">Address <span className="text-red-500">*</span></label>
                            <textarea required rows={3} value={addressText} onChange={(e) => setAddressText(e.target.value)} className="rounded-lg glossy-input px-2.5 py-1.5 text-xs resize-none" placeholder="Enter full address..." />
                          </div>
                          {!addressEditId && (
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="supplierAddressDefault" checked={addressIsDefault} onChange={(e) => setAddressIsDefault(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-blue-600" />
                              <label htmlFor="supplierAddressDefault" className="text-xs font-bold text-zinc-800">Set as Default Address</label>
                            </div>
                          )}
                          <div className="flex items-center gap-2 justify-end">
                            <button type="button" onClick={() => setIsAddressFormOpen(false)} className="rounded-lg glossy-button-white px-3 py-1.5 text-xs cursor-pointer">Cancel</button>
                            <button type="submit" disabled={isPending} className="rounded-lg glossy-button-blue px-3 py-1.5 text-xs text-white cursor-pointer">Save Address</button>
                          </div>
                        </form>
                      )}

                      {supplierDetail.addresses.length === 0 ? (
                        <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-zinc-200 rounded-lg">
                          No addresses added yet. Click "Add Address" above.
                        </div>
                      ) : (
                        <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-zinc-200 bg-zinc-50 font-bold text-zinc-700">
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3 text-center">Default</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                              {supplierDetail.addresses.map((addr) => (
                                <tr key={addr.id} className="hover:bg-zinc-50">
                                  <td className="px-4 py-3 text-zinc-800 max-w-xs">{addr.address}</td>
                                  <td className="px-4 py-3 text-center">
                                    {addr.isDefault ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">Default</span>
                                    ) : (
                                      <button onClick={() => handleSetAddressDefault(addr.id)} className="text-[10px] font-bold text-blue-600 hover:text-blue-500 cursor-pointer">Set Default</button>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                      addr.status === "Active" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                                    }`}>{addr.status}</span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button onClick={() => handleOpenEditAddress(addr)} className="rounded-md glossy-button-white px-2 py-1 text-[10px] cursor-pointer">Edit</button>
                                      <button onClick={() => handleToggleAddressStatus(addr.id)} className={`rounded-md px-2 py-1 text-[10px] font-bold border cursor-pointer ${
                                        addr.status === "Active" ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700" : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                                      }`}>{addr.status === "Active" ? "Deactivate" : "Activate"}</button>
                                      <button onClick={() => handleDeleteAddress(addr.id)} className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100 cursor-pointer">Delete</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
