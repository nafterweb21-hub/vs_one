import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production Terminal — Vision One",
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3">
        <h1 className="text-lg font-bold tracking-wide">Production Terminal</h1>
        <p className="text-xs text-slate-400">Scan IN / OUT — no login required</p>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
