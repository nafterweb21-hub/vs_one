import Link from "next/link";
import { Building2, Shield, Database, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 grid-bg overflow-hidden">
      
      {/* Premium Decorative Glow spots */}
      <div className="absolute top-1/4 left-1/4 -mt-20 -ml-20 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
      
      {/* Glass Container Card */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 text-center py-12 md:py-20 glass-panel rounded-3xl border border-blue-100/50 shadow-xl dark:border-slate-800/80 m-4">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50/80 border border-blue-100 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-900/30 mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Enterprise ERP</span>
        </div>

        {/* Brand Header */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white text-xl font-black">V</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Vision One
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-6">
          Streamline Your Industrial Operations
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-xl mx-auto text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          A high-fidelity manufacturing, inventory, and administrative platform built with Next.js 16, Tailwind CSS, and Prisma.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/signin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-150"
          >
            <span>Sign In to Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/50 text-slate-800 font-bold text-sm px-8 py-3.5 transition-all duration-150 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* Features Minimalist List */}
        <div className="mt-12 pt-8 border-t border-blue-100/40 dark:border-slate-800/60 grid grid-cols-3 gap-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Storage</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">PostgreSQL</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Structure</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">21 Profiles</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Security</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Role Audited</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Info */}
      <footer className="absolute bottom-4 text-center text-xs text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} Vision One ERP. All rights reserved.
      </footer>
    </div>
  );
}
