import type { Metadata } from "next";
import LogoutButton from "./components/LogoutButton";

export const metadata: Metadata = {
  title: "Production Terminal — Vision One",
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="flex items-center justify-between bg-slate-950 border-b border-slate-800 px-6 py-3">
        <div>
          <h1 className="text-lg font-bold tracking-wide">Production Terminal</h1>
          <p className="text-xs text-slate-400">Scan IN / OUT</p>
        </div>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
