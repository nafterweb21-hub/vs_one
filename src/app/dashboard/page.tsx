"use client";

import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  ShoppingCart, 
  FileText, 
  Users, 
  Building2, 
  Settings,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const [activeCompany, setActiveCompany] = useState("Vision One Pte Ltd");

  useEffect(() => {
    const stored = localStorage.getItem("fitprise_company");
    if (stored) {
      setActiveCompany(stored);
    }

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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 shadow-2xl sm:px-12 sm:py-16">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              System Overview
            </span>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome to Vision One ERP
            </h2>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed max-w-xl">
              Manage Sales, Purchasing, Subcon, and Production routing processes all in one centralized platform.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 min-w-[280px] rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/10">
            <div>
              <p className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider">Active Company</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-white" />
                <p className="text-base font-bold text-white">{activeCompany}</p>
              </div>
            </div>
            <div className="h-px w-full bg-white/10"></div>
            <div>
              <p className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider">Purchasing Access</p>
              <p className="mt-1 text-sm font-medium text-white/90">
                {activeCompany === "Vision One Pte Ltd" 
                  ? "Standard & Subcon PO (Full Access)" 
                  : "Standard & Subcon PO (Restricted)"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Operational Metrics
          </h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              label: "Purchase Requisitions", 
              value: "4", 
              sub: "2 awaiting validation", 
              icon: <ShoppingCart className="w-5 h-5" />,
              color: "indigo"
            },
            { 
              label: "Purchase Orders (PO)", 
              value: "2", 
              sub: "Requires Tier 1/2 signoff", 
              icon: <FileText className="w-5 h-5" />,
              color: "amber"
            },
            { 
              label: "Active Work Orders", 
              value: "12", 
              sub: "Production Scan-ins active", 
              icon: <ClipboardList className="w-5 h-5" />,
              color: "sky"
            },
            { 
              label: "Non-Conformance (NCR)", 
              value: "1", 
              sub: "Requires QC check", 
              icon: <AlertCircle className="w-5 h-5" />,
              color: "rose"
            },
          ].map((card) => {
            const colors = {
              indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
              amber: "bg-amber-50 text-amber-600 border-amber-100",
              sky: "bg-sky-50 text-sky-600 border-sky-100",
              rose: "bg-rose-50 text-rose-600 border-rose-100",
            }[card.color];

            return (
              <div
                key={card.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className={`absolute -right-4 -top-4 rounded-full p-4 opacity-50 transition-transform group-hover:scale-150 ${colors}`}>
                  {card.icon}
                </div>
                <div className={`mb-4 inline-flex rounded-xl p-3 ${colors}`}>
                  {card.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {card.value}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {card.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Actions Panel */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Master Profiles Portal */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                System Configurations
              </h4>
              <p className="mt-1 text-sm text-slate-500">Manage Master data profiles that govern the ERP rules</p>
            </div>
            <a
              href="/dashboard/profiles"
              className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="/dashboard/profiles/approval-levels"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100 transition-transform group-hover:scale-110">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Approval Level Profile</h5>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">Configure value bands and multi-tier approvers</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 opacity-60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm border border-slate-100">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">Employee Profile</h5>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">Manage employee codes, FINs &amp; designations</p>
              </div>
            </div>

            <a
              href="/dashboard/profiles/company"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100 transition-transform group-hover:scale-110">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Company Profile</h5>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">AS9100 requirement logs &amp; legal identifiers</p>
              </div>
            </a>
          </div>
        </div>

        {/* Company Quick-Rules Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Tenant Specifications</h4>
              <p className="text-xs font-medium text-slate-500">Rules fetched from active profile</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</p>
              </div>
              <p className="text-sm font-bold text-slate-900">{activeCompany}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">PO linkage to Work Orders</p>
              </div>
              <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 inline-flex px-2 py-1 rounded-md">
                {activeCompany === "Vision One Pte Ltd" 
                  ? "✓ Allowed (Standard)" 
                  : "✗ Forbidden (Standalone)"
                }
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AS9100 Certification Note</p>
              </div>
              <p className="text-sm font-medium text-slate-700">
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
