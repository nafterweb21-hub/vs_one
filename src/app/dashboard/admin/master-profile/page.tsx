import Link from "next/link";
import { 
  Building2, 
  Users, 
  Receipt, 
  Briefcase, 
  FileSignature, 
  Layers,
  Database,
  ArrowRight
} from "lucide-react";
import { masterProfiles } from "@/lib/profiles";

export default function MasterProfilePage() {
  // Helper to map icon key to Lucide react components
  const getIcon = (key: string) => {
    switch (key) {
      case "company": return Building2;
      case "employee": return Users;
      case "approval": return FileSignature;
      case "tax":
      case "currency":
      case "payment":
        return Receipt;
      case "customer":
      case "supplier":
        return Briefcase;
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
        return Layers;
    }
  };

  const activeProfiles = masterProfiles.filter(p => p.isActive);
  const inactiveProfiles = masterProfiles.filter(p => !p.isActive);

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/20">
      
      {/* Premium Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Master Profiles Directory</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Browse operational tables and upcoming configuration templates.
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 overflow-y-auto space-y-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Active section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-md shadow-blue-500/50" />
              <span>Active &amp; Operational Modules</span>
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeProfiles.map((profile) => {
                const Icon = getIcon(profile.iconKey);
                return (
                  <Link 
                    key={profile.title} 
                    href={profile.href} 
                    className="group relative flex flex-col rounded-xl border border-blue-150/60 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-4 border border-blue-100/50 dark:border-blue-900/30">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                      {profile.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {profile.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-450 uppercase tracking-wider">
                      <span>Ready to use</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Inactive section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-450 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Roadmap Profiles &amp; Specifications</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inactiveProfiles.map((profile) => {
                const Icon = getIcon(profile.iconKey);
                return (
                  <Link 
                    key={profile.title} 
                    href={`/dashboard/admin/master-profile/${profile.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-blue-100/40 bg-white/70 p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500 border border-slate-200/50 dark:border-slate-800/50 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/30 dark:group-hover:text-blue-400 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                        {profile.title}
                      </h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 line-clamp-2">
                        {profile.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-550">
                      <span>{profile.roadmapPhase}</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50/50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-bold group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-colors">
                        Preview
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
