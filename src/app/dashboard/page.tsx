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
    <div className="relative space-y-8 animate-fade-in p-2 sm:p-4">
      {/* Subtle glossy background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 mix-blend-multiply blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-sky-400/20 mix-blend-multiply blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-violet-400/20 mix-blend-multiply blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-[0_8px_40px_-12px_rgba(79,70,229,0.5)] border border-indigo-500/30 isolate">
        {/* Glossy reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-50 backdrop-blur-md border border-white/20 shadow-sm">
            System Overview
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight drop-shadow-sm">
            Welcome to FITPRISE EMS
          </h2>
          <p className="mt-3 text-indigo-100 text-sm leading-relaxed max-w-xl">
            Enterprise Resource Planning &amp; Shop Floor Tracking for Vision One Pte Ltd.
            Manage Sales, Purchasing, Subcon, and Production routing processes.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
            <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10 shadow-inner">
              <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Active Company</p>
              <p className="mt-1 text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                {activeCompany}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10 shadow-inner flex-1 min-w-[200px]">
              <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Purchasing Access</p>
              <p className="mt-1 text-sm font-bold text-white">
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
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
          Active Operational Metrics
          <span className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 ml-4"></span>
        </h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              label: "Purchase Requisitions", 
              value: "4 Pending", 
              sub: "2 awaiting validation", 
              color: "from-indigo-500/10 to-indigo-500/5",
              borderColor: "border-indigo-200/50 dark:border-indigo-500/20",
              glow: "group-hover:shadow-indigo-500/20"
            },
            { 
              label: "Purchase Orders (PO)", 
              value: "2 In Approval", 
              sub: "Requires Tier 1/2 signoff", 
              color: "from-amber-500/10 to-amber-500/5",
              borderColor: "border-amber-200/50 dark:border-amber-500/20",
              glow: "group-hover:shadow-amber-500/20"
            },
            { 
              label: "Active Work Orders", 
              value: "12 Shop Floor", 
              sub: "Production Scan-ins active", 
              color: "from-sky-500/10 to-sky-500/5",
              borderColor: "border-sky-200/50 dark:border-sky-500/20",
              glow: "group-hover:shadow-sky-500/20"
            },
            { 
              label: "Non-Conformance (NCR)", 
              value: "1 Open", 
              sub: "Requires QC check", 
              color: "from-rose-500/10 to-rose-500/5",
              borderColor: "border-rose-200/50 dark:border-rose-500/20",
              glow: "group-hover:shadow-rose-500/20"
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} bg-white/70 backdrop-blur-xl p-6 shadow-sm hover:shadow-lg ${card.glow} transition-all duration-300 dark:bg-zinc-900/70 hover:-translate-y-1`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50`}></div>
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </p>
                <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-zinc-800/50 inline-block px-2 py-1 rounded-md">
                  {card.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Actions Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Master Profiles Portal */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/60 backdrop-blur-xl p-7 shadow-xl shadow-zinc-200/40 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 opacity-80"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">System Configurations</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage Master data profiles that govern the ERP rules</p>
            </div>
            <a
              href="/dashboard/profiles"
              className="group flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
            >
              View All 
              <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
          
          <div className="mt-8 grid gap-5 sm:grid-cols-2 relative z-10">
            <a
              href="/dashboard/profiles/approval-levels"
              className="group flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white/80 p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/10 dark:border-zinc-800/60 dark:bg-zinc-950/80 dark:hover:border-indigo-500/50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 shadow-inner group-hover:scale-110 transition-transform duration-300 dark:from-indigo-900/50 dark:to-indigo-950/50 dark:text-indigo-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Approval Level Profile</h5>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Configure value bands and multi-tier approvers</p>
              </div>
            </a>

            <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200/40 bg-zinc-50/50 p-4 opacity-70 cursor-not-allowed dark:border-zinc-800/40 dark:bg-zinc-950/50 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-500 shadow-inner dark:bg-zinc-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Employee Profile</h5>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Manage employee codes, FINs &amp; designations</p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200/40 bg-zinc-50/50 p-4 opacity-70 cursor-not-allowed dark:border-zinc-800/40 dark:bg-zinc-950/50 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-500 shadow-inner dark:bg-zinc-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Currency Profile</h5>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Maintain exchange rates &amp; foreign conversion</p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200/40 bg-zinc-50/50 p-4 opacity-70 cursor-not-allowed dark:border-zinc-800/40 dark:bg-zinc-950/50 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-500 shadow-inner dark:bg-zinc-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Company Profile</h5>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">AS9100 requirement logs &amp; legal identifiers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Quick-Rules Card */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white/60 backdrop-blur-xl p-7 shadow-xl shadow-zinc-200/40 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white relative z-10">Tenant Specifications</h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 relative z-10">Rules fetched from active profile</p>

          <div className="mt-8 space-y-4 relative z-10 flex-1 flex flex-col justify-center">
            <div className="rounded-2xl bg-white/80 p-4 border border-zinc-100 shadow-sm dark:bg-zinc-950/80 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Company Name</p>
              </div>
              <p className="mt-2 text-base font-bold text-zinc-900 dark:text-white ml-8">{activeCompany}</p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 border border-zinc-100 shadow-sm dark:bg-zinc-950/80 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">PO Linkage</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 ml-8 bg-emerald-50 dark:bg-emerald-500/10 inline-block px-2.5 py-1 rounded-lg">
                {activeCompany === "Vision One Pte Ltd" 
                  ? "✓ Allowed (Standard configuration)" 
                  : "✗ Forbidden (PO must stand alone)"
                }
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 border border-zinc-100 shadow-sm dark:bg-zinc-950/80 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <span className="h-2 w-2 rounded-full bg-violet-500"></span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AS9100 Note</p>
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-8">
                {activeCompany === "Vision One Pte Ltd"
                  ? "Toggled on for PR, PO, Subcon forms."
                  : "Not standard for this profile."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
