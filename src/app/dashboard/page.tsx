"use client";

import React, { useState, useEffect } from "react";

export default function DashboardPage() {
  const [activeCompany, setActiveCompany] = useState("Vision One Pte Ltd");

  useEffect(() => {
    // Read initially
    const stored = localStorage.getItem("fitprise_company");
    if (stored) {
      setActiveCompany(stored);
    }

    // Listener for header change
    const handleCompanyChange = () => {
      const updated = localStorage.getItem("fitprise_company");
      if (updated) {
        setActiveCompany(updated);
      }
    };

    window.addEventListener("companyChanged", handleCompanyChange);
    return () => window.removeEventListener("companyChanged", handleCompanyChange);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-lg shadow-indigo-600/10">
        <div className="max-w-2xl">
          <span className="rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            System Overview
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
            Welcome to FITPRISE EMS
          </h2>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Enterprise Resource Planning &amp; Shop Floor Tracking for Vision One Pte Ltd.
            Manage Sales, Purchasing, Subcon, and Production routing processes.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4 border-t border-indigo-500/30 pt-6">
            <div>
              <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Active Company</p>
              <p className="text-sm font-bold text-white">{activeCompany}</p>
            </div>
            <div className="h-8 w-px bg-indigo-500/30"></div>
            <div>
              <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Purchasing Access</p>
              <p className="text-sm font-bold text-white">
                {activeCompany === "Vision One Pte Ltd" 
                  ? "Standard PO & Subcon PO (With or Without Work Order)" 
                  : "Standard PO & Subcon PO (Without Work Order Only)"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div>
        <h3 className="text-base font-semibold text-blue-900 ">Active Operational Metrics</h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              label: "Purchase Requisitions", 
              value: "4 Pending", 
              sub: "2 awaiting validation", 
              color: "border-indigo-500/20",
              text: "text-indigo-600 "
            },
            { 
              label: "Purchase Orders (PO)", 
              value: "2 In Approval", 
              sub: "Requires Tier 1/2 signoff", 
              color: "border-amber-500/20",
              text: "text-amber-600 "
            },
            { 
              label: "Active Work Orders", 
              value: "12 Shop Floor", 
              sub: "Production Scan-ins active", 
              color: "border-sky-500/20",
              text: "text-sky-600 "
            },
            { 
              label: "Non-Conformance (NCR)", 
              value: "1 Open", 
              sub: "Requires QC check", 
              color: "border-rose-500/20",
              text: "text-rose-600 "
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border ${card.color} bg-white p-6 shadow-sm `}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {card.label}
              </p>
              <p className="mt-2.5 text-2xl font-bold text-blue-900 ">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-blue-500 ">
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Actions Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Master Profiles Portal */}
        <div className="md:col-span-2 rounded-xl border border-blue-200 bg-white p-6 shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-blue-900 ">System Configurations</h4>
              <p className="text-xs text-blue-500 ">Manage Master data profiles that govern the ERP rules</p>
            </div>
            <a
              href="/dashboard/profiles"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 :text-indigo-300"
            >
              View All &rarr;
            </a>
          </div>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="/dashboard/profiles/approval-levels"
              className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] :border-indigo-500/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-blue-900 ">Approval Level Profile</h5>
                <p className="mt-0.5 text-xs text-blue-500 ">Configure value bands and multi-tier approvers</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 opacity-70 cursor-not-allowed ">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-200 text-blue-500 ">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-blue-900 ">Employee Profile</h5>
                <p className="mt-0.5 text-xs text-blue-500 ">Manage employee codes, FINs &amp; designations</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 opacity-70 cursor-not-allowed ">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-200 text-blue-500 ">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-blue-900 ">Currency Profile</h5>
                <p className="mt-0.5 text-xs text-blue-500 ">Maintain exchange rates &amp; foreign conversion</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 opacity-70 cursor-not-allowed ">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-200 text-blue-500 ">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-blue-900 ">Company Profile</h5>
                <p className="mt-0.5 text-xs text-blue-500 ">AS9100 requirement logs &amp; legal identifiers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Quick-Rules Card */}
        <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm ">
          <h4 className="text-base font-bold text-blue-900 ">Tenant Specifications</h4>
          <p className="mt-1 text-xs text-blue-500 ">Rules fetched from active profile</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-blue-50 p-3.5 ">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                <p className="text-xs font-bold text-blue-800 ">Company Name</p>
              </div>
              <p className="mt-1.5 text-sm font-medium text-blue-600 ">{activeCompany}</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3.5 ">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <p className="text-xs font-bold text-blue-800 ">PO linkage to Work Orders</p>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-emerald-600 ">
                {activeCompany === "Vision One Pte Ltd" 
                  ? "✓ Allowed (Standard configuration)" 
                  : "✗ Forbidden (PO must stand alone)"
                }
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3.5 ">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-violet-500"></span>
                <p className="text-xs font-bold text-blue-800 ">AS9100 Certification Note</p>
              </div>
              <p className="mt-1.5 text-xs text-blue-600 ">
                {activeCompany === "Vision One Pte Ltd"
                  ? "Toggled on for PR, PO, Subcon forms."
                  : "Not standard for this company profile."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
