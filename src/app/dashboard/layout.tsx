import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-50">
      {/* Sidebar navigation panel */}
      <Sidebar />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Soft atmospheric radial gradients behind page content */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none z-0" />

        {/* Dynamic page contents scrollable */}
        <main className="flex-1 overflow-y-auto relative z-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
