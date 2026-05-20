"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdminOpen, setIsAdminOpen] = useState(true);
  const [isMasterProfileOpen, setIsMasterProfileOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-white text-black font-sans">
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col glossy-sidebar px-6 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/10">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-black">
              Vision One
            </h2>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              FITPRISE ERP
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto px-2">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive("/dashboard")
                  ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600 shadow-xs"
                  : "text-zinc-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M7.5 9.75h9m-9-3H12"
                />
              </svg>
              Dashboard Home
            </Link>
          </div>

          {/* Admin Section */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700"
            >
              <span>Admin Section</span>
              <svg
                className={`h-4.5 w-4.5 transform transition-transform duration-200 ${
                  isAdminOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {isAdminOpen && (
              <div className="mt-1 flex flex-col gap-1 border-l border-zinc-200 pl-3">
                {/* Collapsible Master Profile */}
                <div>
                  <button
                    onClick={() => setIsMasterProfileOpen(!isMasterProfileOpen)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M11.666 16.444a4.5 4.5 0 11-5.332-5.332m5.332 5.332L17.385 21"
                        />
                      </svg>
                      <span>Master Profile</span>
                    </div>
                    <svg
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        isMasterProfileOpen ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>

                  {isMasterProfileOpen && (
                    <div className="mt-1 flex flex-col gap-1 pl-8">
                      <Link
                        href="/dashboard/admin/master-profile/tax"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                          isActive("/dashboard/admin/master-profile/tax")
                            ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600 shadow-xs"
                            : "text-zinc-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Tax Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Card */}
        <div className="mt-auto border-t border-zinc-200 pt-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-black truncate">
                Admin User
              </p>
              <p className="text-xs text-zinc-650 truncate">
                admin@visionone.com.sg
              </p>
            </div>
            <Link
              href="/auth/signin"
              className="text-zinc-400 hover:text-blue-600 transition-colors"
              title="Sign Out"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between glossy-header px-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 lg:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-750 border border-blue-200 shadow-xs">
              System Online
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">{children}</main>
      </div>
    </div>
  );
}
