"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Building2,
  Users,
  Receipt,
  Briefcase,
  FileSignature,
  Layers
} from "lucide-react";
import { masterProfiles } from "@/lib/profiles";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const router = useRouter();

  // State to manage whether the Administration submenu is expanded
  const [isAdminExpanded, setIsAdminExpanded] = useState(true);
  const [isMasterExpanded, setIsMasterExpanded] = useState(true);

  // Automatically expand if currently visiting any admin pages
  useEffect(() => {
    if (pathname.startsWith("/dashboard/admin")) {
      const handle = requestAnimationFrame(() => {
        setIsAdminExpanded(true);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/admin/master-profile")) {
      const handle = requestAnimationFrame(() => {
        setIsMasterExpanded(true);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [pathname]);

  const handleAdminClick = () => {
    if (!pathname.startsWith("/dashboard/admin")) {
      router.push("/dashboard/admin");
      setIsAdminExpanded(true);
    } else {
      setIsAdminExpanded(!isAdminExpanded);
    }
  };

  // Helper to map icon key to Lucide react components
  const getIcon = (key: string) => {
    switch (key) {
      case "company": return <Building2 className="w-3.5 h-3.5" />;
      case "employee": return <Users className="w-3.5 h-3.5" />;
      case "approval": return <FileSignature className="w-3.5 h-3.5" />;
      case "tax":
      case "currency":
      case "payment":
        return <Receipt className="w-3.5 h-3.5" />;
      case "customer":
      case "supplier":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "uom":
      case "category":
      case "material":
      case "finished-good":
      case "material-type":
      case "welding":
      case "joint":
      case "machine":
      case "elcometer":
      case "process-main":
      case "painting":
      case "routing-process":
      case "failure":
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans select-none overflow-hidden">
      
      {/* Premium Left-Hand Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        
        {/* Sidebar Header with Brand Logo */}
        <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/dashboard" className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white text-sm font-black">V</span>
            </div>
            <span>Vision One</span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          
          {/* Main Administration Navigation Link with Submenu Toggle */}
          <div>
            <button
              onClick={handleAdminClick}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                pathname.startsWith("/dashboard/admin")
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 dark:bg-blue-600 dark:text-white"
                  : "text-slate-600 hover:bg-blue-50/50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-blue-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-4 h-4 ${pathname.startsWith("/dashboard/admin") ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
                <span>Administration</span>
              </div>
              <div>
                {isAdminExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 opacity-80" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                )}
              </div>
            </button>

            {/* Nested Submenu under Administration */}
            {isAdminExpanded && (
              <div className="mt-1 ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 transition-all duration-300">
                
                {/* Collapsible Master Profiles Submenu Head */}
                <div>
                  <button
                    onClick={() => setIsMasterExpanded(!isMasterExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      pathname.startsWith("/dashboard/admin/master-profile")
                        ? "bg-blue-50 text-blue-750 dark:bg-blue-950/40 dark:text-blue-300"
                        : "text-slate-500 hover:bg-blue-50/30 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Master Profiles</span>
                    </div>
                    <div>
                      {isMasterExpanded ? (
                        <ChevronUp className="w-3 h-3 opacity-80" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-80" />
                      )}
                    </div>
                  </button>

                  {/* 21 Profiles Sub-Submenu with dynamic scroll constraint */}
                  {isMasterExpanded && (
                    <div className="mt-1 ml-3 pl-2.5 border-l border-slate-100 dark:border-slate-800 space-y-0.5 max-h-[360px] overflow-y-auto pr-1">
                      {masterProfiles.filter(p => p.isActive).map((profile) => {
                        const icon = getIcon(profile.iconKey);
                        const href = profile.slug === "company" 
                           ? "/dashboard/admin/master-profile/company" 
                           : `/dashboard/admin/master-profile/${profile.slug}`;
                        const isProfileActive = profile.slug === "company"
                          ? pathname === "/dashboard/admin/master-profile/company"
                          : pathname === `/dashboard/admin/master-profile/${profile.slug}`;
                        return (
                          <SubNavItem
                            key={profile.slug}
                            href={href}
                            icon={icon}
                            label={profile.title}
                            isActive={isProfileActive}
                            isRoadmap={!profile.isActive}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900/10">
          <Link 
            href="/auth/signin" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-500 rounded-lg hover:bg-blue-50/50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-blue-400 transition-colors"
          >
            <LogOut className="w-4 h-4 text-blue-550 dark:text-blue-450" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6 bg-slate-50/30 dark:bg-slate-950/30">


          {children}
        </main>
      </div>
    </div>
  );
}


// Submenu Item Component with Active Highlighting & Roadmap styling
function SubNavItem({ 
  href, 
  icon, 
  label, 
  isActive, 
  isRoadmap 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  isActive?: boolean;
  isRoadmap?: boolean;
}) {
  const pathname = usePathname();
  const resolvedActive = isActive !== undefined 
    ? isActive 
    : (href === "/dashboard/admin/master-profile"
        ? pathname === href
        : pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
        resolvedActive
          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 shadow-sm border-l-2 border-blue-500 pl-2 rounded-l-none"
          : isRoadmap
            ? "text-slate-400 dark:text-slate-500 hover:bg-blue-50/30 hover:text-blue-600 dark:hover:bg-slate-850/40 dark:hover:text-blue-400"
            : "text-slate-500 dark:text-slate-400 hover:bg-blue-50/40 hover:text-blue-600 dark:hover:bg-slate-850 dark:hover:text-blue-400"
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden truncate">
        <span className={resolvedActive ? "text-blue-600 dark:text-blue-400" : isRoadmap ? "text-slate-400/80 dark:text-slate-500/80" : "text-slate-400 dark:text-slate-500"}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
}

