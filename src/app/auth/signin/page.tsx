import Link from "next/link";

import { ArrowLeft, KeyRound, Sparkles } from "lucide-react";

export default function SignIn() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 grid-bg overflow-hidden p-4">
      
      {/* Premium Decorative Glow spots */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-blue-150/40 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 glass-panel">
        
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 mb-3">
            <span className="text-white text-base font-black">V</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
            Vision One Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Secure Administrator Access
          </p>
        </div>

        {/* Info panel */}
        <div className="mb-6 rounded-xl bg-blue-50/50 p-4 border border-blue-100/50 dark:bg-blue-950/20 dark:border-blue-900/30">
          <div className="flex gap-2">
            <KeyRound className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300">Authentication Setup</h4>
              <p className="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-400/80">
                Please configure an active authentication provider in <code className="bg-white/80 dark:bg-slate-900/60 px-1 py-0.5 rounded font-mono text-[10px]">src/lib/auth.ts</code> to initialize user directories.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Button to go directly to Dashboard since it's a mockup portal */}
        <div className="space-y-4 mb-6">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-3 shadow-md transition-all active:scale-[0.98] duration-100"
          >
            <span>Bypass to Dashboard (Demo)</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>



          </Link>
        </div>
      </div>
    </div>
  );
}
