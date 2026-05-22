import Link from "next/link";
import { Database, ShieldCheck, Settings } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/20">
      
      {/* Header Panel */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Administration Command Center</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Configure baseline systems, operational profiles, databases, and general CRM rules.
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl grid gap-6 sm:grid-cols-2">
          
          <Link href="/dashboard/admin/master-profile" className="block group">
            <div className="h-full rounded-xl border border-blue-100/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/40 dark:border-blue-900/30">
                <Database className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                Master Profiles
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Manage all baseline configurations including Company data, Employee lists, Machines, and Materials.
              </p>
            </div>
          </Link>

          <div className="rounded-xl border border-dashed border-blue-150/40 bg-blue-50/10 p-6 dark:border-slate-800/80 dark:bg-slate-900/10 flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/50">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-400 dark:text-slate-500">
                Security Policies
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                Authorized role permissions, system keychains, and automated auditing logs are managed here.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Roadmap Feature
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
