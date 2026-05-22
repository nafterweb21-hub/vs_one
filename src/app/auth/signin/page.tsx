import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-white">
          Sign In
        </h2>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Configure an auth provider in{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
            src/lib/auth.ts
          </code>{" "}
          to enable sign-in.
        </p>
        {/* Auth provider buttons will go here once configured */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
