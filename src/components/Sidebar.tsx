"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Coins,
  LayoutDashboard,
  Menu,
  X,
  Users,
  Percent,
  UserCircle,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (path: string) => {
    // Exact match for dashboard or check if it starts with the path for nested routes
    const active = path === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(path);
    return `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      active
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1"
        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
    }`;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-full ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center gap-3 bg-gradient-to-r from-blue-600/5 to-sky-600/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
            V
          </div>
          <div>
            <h1 className="font-bold text-sm text-zinc-950 dark:text-white tracking-wide">
              FITPRISE EMS
            </h1>
            <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Vision One ERP
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className={linkClass("/dashboard")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Home</span>
          </Link>

          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              General Master
            </p>
            <Link
              href="/dashboard/profiles/currency"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/currency")}
            >
              <Coins size={16} />
              <span>Currency Master</span>
            </Link>
            <Link
              href="/dashboard/master-profile/employee"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/employee")}
            >
              <Users size={16} />
              <span>Employee Profile</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Admin Master
            </p>
            <Link
              href="/dashboard/admin/master-profile/tax"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/admin/master-profile/tax")}
            >
              <Percent size={16} />
              <span>Tax Profile</span>
            </Link>
            <Link
              href="/dashboard/admin/master-profile/customer"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/admin/master-profile/customer")}
            >
              <UserCircle size={16} />
              <span>Customer Profile</span>
            </Link>
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 text-center">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            FITPRISE EMS v1.1
          </p>
        </div>
      </aside>
    </>
  );
}
