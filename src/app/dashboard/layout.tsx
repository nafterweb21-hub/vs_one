"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMasterProfileOpen, setIsMasterProfileOpen] = useState(true);

  // Auto-expand "Master Profile" if current route is under master-profile
  useEffect(() => {
    if (pathname.includes("/master-profile")) {
      Promise.resolve().then(() => {
        setIsMasterProfileOpen(true);
      });
    }
  }, [pathname]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
  ];

  const masterProfileItems = [
    {
      label: "Employee Profile",
      href: "/dashboard/master-profile/employee",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-300 border-r border-zinc-800/80">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-900 bg-zinc-950/40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <span className="text-sm font-black text-white tracking-widest">VO</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Fitprise</h2>
            <p className="text-[10px] text-zinc-400 font-semibold tracking-wider">EMS • VISION ONE</p>
          </div>
        </Link>
        
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200"
        >
          <svg
            className={`h-4.5 w-4.5 transform transition-transform duration-200 ${isSidebarOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar">
        <div>
          <span className="px-3 text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Main Navigation</span>
          <div className="mt-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-inner shadow-black/10 border-l-[3px] border-cyan-500 pl-[11px]"
                      : "hover:bg-zinc-900/60 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-cyan-400" : "text-zinc-400 group-hover:text-white"}>{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Collapsible Master Profile Menu */}
        <div>
          <button
            onClick={() => setIsMasterProfileOpen(!isMasterProfileOpen)}
            className="w-full flex items-center justify-between px-3 text-[10px] font-bold text-zinc-500 tracking-wider uppercase hover:text-zinc-300 transition-colors"
          >
            <span>{isSidebarOpen ? "Master Profile" : "Profiles"}</span>
            {isSidebarOpen && (
              <svg
                className={`h-3 w-3 transform transition-transform duration-200 ${isMasterProfileOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {isMasterProfileOpen && (
            <div className="mt-3 space-y-1 pl-1">
              {masterProfileItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-zinc-900 text-white border-l-[3px] border-cyan-500 pl-[11px]"
                        : "hover:bg-zinc-900/60 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-cyan-400" : "text-zinc-400 group-hover:text-white"}>{item.icon}</span>
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="border-t border-zinc-900 p-4 bg-zinc-950/20">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-zinc-900/40 border border-zinc-900/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-white font-bold text-sm shadow border border-zinc-700">
            A
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-zinc-500 truncate">admin@visionone.com</p>
            </div>
          )}
          {isSidebarOpen && (
            <Link
              href="/"
              className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-zinc-900 transition-colors"
              title="Sign Out"
            >
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 antialiased">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:block h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay Background */}
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-zinc-950 transition duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-zinc-900 text-white"
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-screen">
        {/* Top Header navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Title / Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              <span className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">Fitprise EMS</span>
              <span>/</span>
              {pathname.includes("/master-profile") && (
                <>
                  <span className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">Master Profile</span>
                  <span>/</span>
                </>
              )}
              <span className="text-zinc-900 dark:text-zinc-100 font-bold capitalize">
                {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Home Page
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 flex flex-col relative overflow-y-auto">
          {children}
        </main>
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
                      <Link
                        href="/dashboard/admin/master-profile/customer"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                          isActive("/dashboard/admin/master-profile/customer")
                            ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600 shadow-xs"
                            : "text-zinc-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Customer Profile
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
