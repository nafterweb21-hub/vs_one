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
  Ruler,
  Gauge,
  Cpu,
  Truck,
  Package,
  Box,
  Flame,
  ShoppingCart,
  CreditCard,
  Paintbrush,
  ClipboardList,
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
        : "text-blue-600 hover:bg-blue-50 :bg-blue-800 hover:text-blue-700 :text-white"
    }`;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white border border-blue-200 shadow-md text-blue-600 hover:bg-blue-50 :bg-blue-800"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-blue-950/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-xl border-r border-blue-100 flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-full shadow-lg shadow-blue-900/5 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-6 border-b border-blue-100 flex items-center gap-3 bg-gradient-to-r from-blue-600/5 to-sky-600/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
            V
          </div>
          <div>
            <h1 className="font-bold text-sm text-blue-950 tracking-wide">
              FITPRISE EMS
            </h1>
            <p className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
              Vision One ERP
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-blue-200 ">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className={linkClass("/dashboard")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Home</span>
          </Link>

          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Sales
            </p>
            <Link
              href="/dashboard/sales/sales-order"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/sales/sales-order")}
            >
              <ShoppingCart size={16} />
              <span>Sales Orders</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Production
            </p>
            <Link
              href="/dashboard/production/work-order"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/production/work-order")}
            >
              <ClipboardList size={16} />
              <span>Work Orders</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
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
              href="/dashboard/profiles/company"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/company")}
            >
              <Users size={16} />
              <span>Company Profile</span>
            </Link>
            <Link
              href="/dashboard/profiles/uom"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/uom")}
            >
              <Ruler size={16} />
              <span>UOM Profile</span>
            </Link>
            <Link
              href="/dashboard/profiles/elcometer"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/elcometer")}
            >
              <Gauge size={16} />
              <span>Elcometer Profile</span>
            </Link>
            <Link
              href="/dashboard/profiles/machine"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/machine")}
            >
              <Cpu size={16} />
              <span>Machine Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/employee"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/employee")}
            >
              <Users size={16} />
              <span>Employee Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/material"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/material")}
            >
              <Box size={16} />
              <span>Material Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/welding-type"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/welding-type")}
            >
              <Flame size={16} />
              <span>Welding Type Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/joint"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/joint")}
            >
              <ClipboardList size={16} />
              <span>Joint Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/painting-method"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/painting-method")}
            >
              <Paintbrush size={16} />
              <span>Painting Method Profile</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
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
            <Link
              href="/dashboard/admin/master-profile/supplier"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/admin/master-profile/supplier")}
            >
              <Truck size={16} />
              <span>Supplier Profile</span>
            </Link>
            <Link
              href="/dashboard/admin/master-profile/finished-good"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/admin/master-profile/finished-good")}
            >
              <Package size={16} />
              <span>Finished Good Profile</span>
            </Link>
            <Link
              href="/dashboard/profiles/payment-term"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/payment-term")}
            >
              <CreditCard size={16} />
              <span>Payment Term Profile</span>
            </Link>
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="p-4 border-t border-blue-100 bg-blue-50/50 text-center">
          <p className="text-[10px] text-blue-400 font-medium">
            FITPRISE EMS v1.1
          </p>
        </div>
      </aside>
    </>
  );
}
