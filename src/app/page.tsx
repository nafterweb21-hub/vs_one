export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-blue-50 ">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-blue-900 ">
          Vision One ERP
        </h1>
        <p className="max-w-md text-lg text-blue-600 ">
          Enterprise Resource Planning — built with Next.js 16, Tailwind CSS,
          Prisma &amp; PostgreSQL.
        </p>
        <div className="flex gap-4">
          <a
            href="/auth/signin"
            className="rounded-lg bg-blue-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 :bg-blue-200"
          >
            Sign In
          </a>
          <a
            href="/dashboard"
            className="rounded-lg border border-blue-300 px-6 py-3 text-sm font-medium text-blue-900 transition hover:bg-blue-100 :bg-blue-800"
          >
            Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
