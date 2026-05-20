export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Vision One ERP
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Enterprise Resource Planning — built with Next.js 16, Tailwind CSS,
          Prisma &amp; PostgreSQL.
        </p>
        <div className="flex gap-4">
          <a
            href="/auth/signin"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign In
          </a>
          <a
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
