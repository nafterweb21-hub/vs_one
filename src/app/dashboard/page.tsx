import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <nav className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: "—" },
            { label: "Active Orders", value: "—" },
            { label: "Revenue", value: "—" },
            { label: "Inventory Items", value: "—" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
