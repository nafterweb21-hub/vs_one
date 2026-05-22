"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Define profile modules for the sidebar sub-menu
const PROFILE_MODULES = [
  { name: "Approval Level Profile", href: "/dashboard/profiles/approval-levels", active: true },
  { name: "Material Category Profile", href: "/dashboard/profiles/material-categories", active: true },
  { name: "Material Type Profile", href: "/dashboard/profiles/material-types", active: true },
  { name: "Main Process Profile", href: "/dashboard/profiles/main-processes", active: true },
  { name: "Process Profile", href: "/dashboard/profiles/process-profiles", active: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Interactive state
  const [activeCompany, setActiveCompany] = useState("Vision One Pte Ltd");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfilesOpen, setIsProfilesOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Sync mounting state
  useEffect(() => {
    setMounted(true);
    const storedCompany = localStorage.getItem("fitprise_company");
    if (storedCompany) {
      setActiveCompany(storedCompany);
    }
  }, []);

  const handleCompanyChange = (company: string) => {
    setActiveCompany(company);
    localStorage.setItem("fitprise_company", company);
    // Reload/dispatch an event if other components need to react
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("companyChanged"));
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm font-medium text-zinc-400">Loading FITPRISE EMS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-zinc-900 text-zinc-100 transition-transform duration-300 ease-in-out dark:border-zinc-800 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">FITPRISE EMS</h1>
            <p className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">Enterprise System</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {/* Main Menu */}
          <div>
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Core</div>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/dashboard"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                  </svg>
                  Overview
                </a>
              </li>
            </ul>
          </div>

          {/* Master Profiles Menu */}
          <div>
            <button
              onClick={() => setIsProfilesOpen(!isProfilesOpen)}
              className="flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300"
            >
              <span>Master Profiles</span>
              <svg
                className={`h-4.5 w-4.5 transform transition-transform duration-200 ${isProfilesOpen ? "rotate-90" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className={`mt-2 transition-all duration-300 ${isProfilesOpen ? "block" : "hidden"}`}>
              <ul className="space-y-1 pl-2">
                <li>
                  <a
                    href="/dashboard/profiles"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/dashboard/profiles"
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                      }`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    All Master Profiles
                  </a>
                </li>
                {/* Specific Sub Profiles */}
                {PROFILE_MODULES.map((sub) => {
                  const isActive = pathname.startsWith(sub.href);
                  return (
                    <li key={sub.name}>
                      <a
                        href={sub.href}
                        className={`flex items-center justify-between rounded-lg py-1.5 pl-9 pr-3 text-xs transition-colors ${isActive
                            ? "font-semibold text-indigo-400"
                            : "text-zinc-400 hover:text-zinc-200"
                          }`}
                      >
                        <span>{sub.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

        </nav>

        {/* Footer Active Account */}
        <div className="border-t border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-sm shadow">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">System Administrator</p>
              <p className="text-[10px] text-zinc-400 truncate">admin@visionone.com</p>
            </div>
            <a
              href="/auth/signin"
              className="ml-auto text-zinc-500 hover:text-zinc-200"
              title="Sign Out"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-900/60 lg:hidden"
        ></div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Sidebar toggle button (Desktop) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              title="Toggle Sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb Info / Company Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              {/* Company Switcher */}
              <div className="relative flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Tenant:</span>
                <select
                  value={activeCompany}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300"
                >
                  <option value="Vision One Pte Ltd">Vision One Pte Ltd</option>
                  <option value="Vision Laser Pte Ltd">Vision Laser Pte Ltd</option>
                </select>
                <span
                  className={`inline-block h-2 w-2 rounded-full ${activeCompany === "Vision One Pte Ltd" ? "bg-indigo-500" : "bg-teal-500"
                    }`}
                ></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick system status badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-[11px]">System Online</span>
            </div>

            {/* System Info Toggle details */}
            <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              v1.1 (Enhanzcom)
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
