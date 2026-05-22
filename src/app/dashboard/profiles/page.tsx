"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Coins,
  Loader2,
  ArrowRight,
  TrendingUp,
  Database,
  CheckCircle2,
  XCircle,
  Ruler,
  Gauge,
  Cpu,
} from "lucide-react";

export default function ProfilesDashboard() {
  const [stats, setStats] = useState<Record<string, { total: number; active: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/profiles/summary");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed loading profile counts: ", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const currencyStats = stats["currency"] || { total: 0, active: 0 };
  const uomStats      = stats["uom"]      || { total: 0, active: 0 };
  const elcometerStats = stats["elcometer"] || { total: 0, active: 0 };
  const machineStats = stats["machine"] || { total: 0, active: 0 };

  return (
    <div className="p-6 lg:p-10 space-y-8 relative">
      {/* Welcome header */}
      <div className="relative rounded-2xl overflow-hidden border border-blue-500/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 lg:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-sky-600/10 blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp size={12} />
            <span>Settings / Master</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Master Profiles
          </h2>
          <p className="text-zinc-400 text-sm lg:text-base leading-relaxed">
            Manage system-wide configuration data, including currencies, units of measurement, measuring gauges, and machines.
          </p>
        </div>
      </div>

      {/* KPI Metric Strip — Currency */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Currencies",
            value: loading ? "..." : currencyStats.total.toString(),
            desc: "Registered currency codes",
            icon: Database,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
            border: "border-blue-500/10",
          },
          {
            label: "Active Currencies",
            value: loading ? "..." : currencyStats.active.toString(),
            desc: "Available for transactions",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/10",
          },
          {
            label: "Deactive Currencies",
            value: loading ? "..." : (currencyStats.total - currencyStats.active).toString(),
            desc: "Deactivated denominations",
            icon: XCircle,
            color: "text-sky-500",
            bg: "bg-sky-500/5",
            border: "border-sky-500/10",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-xl border ${card.border} bg-white dark:bg-zinc-900 p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {card.label}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {card.desc}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300 z-10`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Metric Strip — UOM */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total UOMs",
            value: loading ? "..." : uomStats.total.toString(),
            desc: "Registered unit types",
            icon: Database,
            color: "text-violet-500",
            bg: "bg-violet-500/5",
            border: "border-violet-500/10",
          },
          {
            label: "Active UOMs",
            value: loading ? "..." : uomStats.active.toString(),
            desc: "Available for use",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/10",
          },
          {
            label: "Deactive UOMs",
            value: loading ? "..." : (uomStats.total - uomStats.active).toString(),
            desc: "Deactivated units",
            icon: XCircle,
            color: "text-purple-500",
            bg: "bg-purple-500/5",
            border: "border-purple-500/10",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-xl border ${card.border} bg-white dark:bg-zinc-900 p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {card.label}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {card.desc}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300 z-10`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Metric Strip — Elcometer */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Elcometers",
            value: loading ? "..." : elcometerStats.total.toString(),
            desc: "Registered serial numbers",
            icon: Database,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
            border: "border-blue-500/10",
          },
          {
            label: "Active Elcometers",
            value: loading ? "..." : elcometerStats.active.toString(),
            desc: "Available for routing processes",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/10",
          },
          {
            label: "Deactive Elcometers",
            value: loading ? "..." : (elcometerStats.total - elcometerStats.active).toString(),
            desc: "Deactivated gauges",
            icon: XCircle,
            color: "text-sky-500",
            bg: "bg-sky-500/5",
            border: "border-sky-500/10",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-xl border ${card.border} bg-white dark:bg-zinc-900 p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {card.label}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {card.desc}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300 z-10`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>
      {/* KPI Metric Strip — Machine */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Machines",
            value: loading ? "..." : machineStats.total.toString(),
            desc: "Registered machines & welders",
            icon: Database,
            color: "text-amber-500",
            bg: "bg-amber-500/5",
            border: "border-amber-500/10",
          },
          {
            label: "Active Machines",
            value: loading ? "..." : machineStats.active.toString(),
            desc: "Available for production orders",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/10",
          },
          {
            label: "Deactive Machines",
            value: loading ? "..." : (machineStats.total - machineStats.active).toString(),
            desc: "Deactivated machine units",
            icon: XCircle,
            color: "text-amber-600",
            bg: "bg-amber-600/5",
            border: "border-amber-600/10",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-xl border ${card.border} bg-white dark:bg-zinc-900 p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {card.label}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {card.desc}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300 z-10`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>


      {/* Quick Action Cards */}
      {loading ? (
        <div className="h-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500">Loading...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Currency card */}
          <Link
            href="/dashboard/profiles/currency"
            className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300">
                <Coins size={22} className="transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Currency Master
                  </h4>
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-600 dark:text-blue-400 transition-all duration-300" />
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Manage currency codes, exchange rates, and default currency.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">Total Records</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-950 dark:text-white font-bold">{currencyStats.total}</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currencyStats.active} Active</span>
              </div>
            </div>
          </Link>

          {/* UOM card */}
          <Link
            href="/dashboard/profiles/uom"
            className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-violet-500 dark:hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:text-white transition-all duration-300">
                <Ruler size={22} className="transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-zinc-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    UOM Profile
                  </h4>
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-violet-600 dark:text-violet-400 transition-all duration-300" />
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Manage units of measurement (Piece, Pair, Box, Kg, Meter) for orders and materials.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">Total Records</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-950 dark:text-white font-bold">{uomStats.total}</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{uomStats.active} Active</span>
              </div>
            </div>
          </Link>

          {/* Elcometer card */}
          <Link
            href="/dashboard/profiles/elcometer"
            className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300">
                <Gauge size={22} className="transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Elcometer Profile
                  </h4>
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-600 dark:text-blue-400 transition-all duration-300" />
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Manage Elcometer Serial Numbers for Dry Film Thickness spray painting measurements.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">Total Records</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-950 dark:text-white font-bold">{elcometerStats.total}</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{elcometerStats.active} Active</span>
              </div>
            </div>
          </Link>
          {/* Machine card */}
          <Link
            href="/dashboard/profiles/machine"
            className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white transition-all duration-300">
                <Cpu size={22} className="transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-zinc-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Machine Profile
                  </h4>
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-amber-600 dark:text-amber-400 transition-all duration-300" />
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Manage machines and welding equipment parameters, specifications, and files.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">Total Records</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-950 dark:text-white font-bold">{machineStats.total}</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{machineStats.active} Active</span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
