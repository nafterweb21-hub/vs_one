import { Users, ShoppingBag, DollarSign, Package, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const cards = [
    { label: "Total Users", value: "1,248", change: "+12% from last month", icon: Users, color: "blue" },
    { label: "Active Orders", value: "84", change: "+5% today", icon: ShoppingBag, color: "indigo" },
    { label: "Revenue", value: "$45,280", change: "+18.2% this week", icon: DollarSign, color: "emerald" },
    { label: "Inventory Items", value: "3,120", change: "42 items low in stock", icon: Package, color: "sky" },
  ];

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/20">
      
      {/* Premium Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Dashboard Overview</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Welcome back. Here is the operational summary for Vision One.
            </p>
          </div>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <main className="flex-1 overflow-y-auto space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="relative overflow-hidden rounded-xl border border-blue-100/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Premium blue top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-right from-blue-500 to-indigo-600" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {card.value}
                    </p>
                  </div>
                  
                  {/* Decorative Icon Container */}
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/65">
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {card.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Placeholder Panel */}
        <div className="rounded-xl border border-blue-100/50 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50 glass-panel">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Operational Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Detailed chart grids, batch scheduling tracking, and shipping logistics pipelines are operational under the respective administration nodes.
          </p>
        </div>
      </main>


    </div>
  );
}
