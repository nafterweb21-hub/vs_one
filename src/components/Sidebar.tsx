"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { canAccess, type Role } from "@/lib/access";
import {
  Coins,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Users,
  Percent,
  UserCircle,
  UserCog,
  Ruler,
  Gauge,
  Cpu,
  Truck,
  Package,
  PackageCheck,
  PackageX,
  Box,
  Flame,
  ShoppingCart,
  FileText,
  CreditCard,
  Paintbrush,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  userEmail?: string | null;
  userRole?: string | null;
  isAdmin?: boolean;
}

export default function Sidebar({ userEmail, userRole, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const role = (userRole ?? null) as Role | null;
  const allow = (path: string) => canAccess(path, role);

  const linkClass = (path: string) => {
    // Exact match for dashboard or check if it is exactly the path or starts with the path + "/" for nested routes
    const active = path === "/dashboard" ? pathname === "/dashboard" : pathname === path || pathname.startsWith(path + "/");
    return `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      active
        ? "bg-indigo-600 text-white shadow-md shadow-slate-500/20 translate-x-1"
        : "text-indigo-600 hover:bg-slate-50 :bg-indigo-800 hover:text-indigo-700 :text-white"
    }`;
  };

  return (
    <>
      {/* Mobile & Desktop Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 z-50 p-2.5 rounded-xl border shadow-sm transition-all duration-300 ${
          isOpen 
            ? "left-[19rem] bg-white border-slate-200 text-slate-600 hover:bg-slate-50" 
            : "left-6 bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200 flex flex-col transition-transform duration-300 transform shadow-2xl shadow-slate-900/10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center gap-3 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-slate-500/30">
            V
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 tracking-wide">
              FITPRISE EMS
            </h1>
            <p className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase">
              Vision One ERP
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 ">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className={linkClass("/dashboard")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Home</span>
          </Link>

          {allow("/dashboard/sales/sales-order") && (
            <div className="pt-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Sales
              </p>
              <Link
                href="/dashboard/sales/quotation"
                onClick={() => setIsOpen(false)}
                className={linkClass("/dashboard/sales/quotation")}
              >
                <FileText size={16} />
                <span>Costing & Quotation</span>
              </Link>
              <Link
                href="/dashboard/sales/sales-order"
                onClick={() => setIsOpen(false)}
                className={linkClass("/dashboard/sales/sales-order")}
              >
                <ShoppingCart size={16} />
                <span>Sales Orders</span>
              </Link>
            </div>
          )}

          {allow("/dashboard/production/work-order") && (
            <div className="pt-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
          )}

          {(allow("/dashboard/purchasing/purchase-requisition") || 
             allow("/dashboard/purchasing/purchase-order") ||
             allow("/dashboard/purchasing/purchase-order-approval") ||
             allow("/dashboard/purchasing/goods-receive") ||
             allow("/dashboard/purchasing/goods-return")) && (
            <div className="pt-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Purchasing
              </p>
              {allow("/dashboard/purchasing/purchase-requisition") && (
                <Link
                  href="/dashboard/purchasing/purchase-requisition"
                  onClick={() => setIsOpen(false)}
                  className={linkClass("/dashboard/purchasing/purchase-requisition")}
                >
                  <ShoppingCart size={16} />
                  <span>Purchase Requisitions</span>
                </Link>
              )}
              {allow("/dashboard/purchasing/purchase-order") && (
                <Link
                  href="/dashboard/purchasing/purchase-order"
                  onClick={() => setIsOpen(false)}
                  className={linkClass("/dashboard/purchasing/purchase-order")}
                >
                  <FileText size={16} />
                  <span>Purchase Orders</span>
                </Link>
              )}
              {allow("/dashboard/purchasing/purchase-order-approval") && (
                <Link
                  href="/dashboard/purchasing/purchase-order-approval"
                  onClick={() => setIsOpen(false)}
                  className={linkClass("/dashboard/purchasing/purchase-order-approval")}
                >
                  <ClipboardList size={16} />
                  <span>Purchase Order Approval</span>
                </Link>
              )}
              {allow("/dashboard/purchasing/goods-receive") && (
                <Link
                  href="/dashboard/purchasing/goods-receive"
                  onClick={() => setIsOpen(false)}
                  className={linkClass("/dashboard/purchasing/goods-receive")}
                >
                  <PackageCheck size={16} />
                  <span>Goods Receive</span>
                </Link>
              )}
              {allow("/dashboard/purchasing/goods-return") && (
                <Link
                  href="/dashboard/purchasing/goods-return"
                  onClick={() => setIsOpen(false)}
                  className={linkClass("/dashboard/purchasing/goods-return")}
                >
                  <PackageX size={16} />
                  <span>Goods Return</span>
                </Link>
              )}
            </div>
          )}

          {allow("/dashboard/qc/ncr") && (
            <div className="pt-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Quality Control
              </p>
              <Link
                href="/dashboard/qc/ncr"
                onClick={() => setIsOpen(false)}
                className={linkClass("/dashboard/qc/ncr")}
              >
                <ClipboardList size={16} />
                <span>Non-Conformance Report (NCR)</span>
              </Link>
            </div>
          )}

          {allow("/dashboard/profiles/currency") && (
          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
              href="/dashboard/master-profile/department"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/department")}
            >
              <Users size={16} />
              <span>Department Master</span>
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
              href="/dashboard/profiles/material-categories"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/material-categories")}
            >
              <Box size={16} />
              <span>Material Category Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/material-type"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/material-type")}
            >
              <Box size={16} />
              <span>Material Type Profile</span>
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
              href="/dashboard/master-profile/failure-mode"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/failure-mode")}
            >
              <ClipboardList size={16} />
              <span>Failure Mode Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/painting-method"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/painting-method")}
            >
              <Paintbrush size={16} />
              <span>Painting Method Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/main-process"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/main-process")}
            >
              <ClipboardList size={16} />
              <span>Main Process Profile</span>
            </Link>
            <Link
              href="/dashboard/master-profile/process-profile"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/master-profile/process-profile")}
            >
              <ClipboardList size={16} />
              <span>Process Profile</span>
            </Link>
          </div>
          )}

          {allow("/dashboard/admin/master-profile/tax") && (
          <div className="pt-4">
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
            <Link
              href="/dashboard/profiles/approval-levels"
              onClick={() => setIsOpen(false)}
              className={linkClass("/dashboard/profiles/approval-levels")}
            >
              <ClipboardList size={16} />
              <span>Approval Level Profile</span>
            </Link>
            {isAdmin && allow("/dashboard/admin/users") && (
              <Link
                href="/dashboard/admin/users"
                onClick={() => setIsOpen(false)}
                className={linkClass("/dashboard/admin/users")}
              >
                <UserCog size={16} />
                <span>User Management</span>
              </Link>
            )}
          </div>
          )}
        </div>

        {/* Footer: user + sign out */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4">
          {userEmail && (
            <div className="mb-3 px-1">
              <p className="truncate text-xs font-semibold text-slate-900">{userEmail}</p>
              {userRole && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {userRole}
                </p>
              )}
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-slate-200"
          >
            <LogOut size={14} />
            Sign out
          </button>
          <p className="mt-3 text-center text-[10px] font-medium text-slate-500">
            FITPRISE EMS v1.1
          </p>
        </div>
      </aside>
    </>
  );
}
