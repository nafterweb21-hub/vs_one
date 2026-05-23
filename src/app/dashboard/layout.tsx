import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans antialiased text-blue-900 ">
      {/* Sidebar navigation panel */}
      <Sidebar
        userEmail={session?.user?.email}
        userRole={session?.user?.role}
        isAdmin={isAdmin}
      />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Soft atmospheric radial gradients behind page content */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-sky-200/40 blur-[100px] pointer-events-none z-0" />

        {/* Dynamic page contents scrollable */}
        <main className="flex-1 overflow-y-auto relative z-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
