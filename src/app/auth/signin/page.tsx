import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex flex-1 items-center justify-center bg-blue-50 ">
      <div className="w-full max-w-sm rounded-xl border border-blue-200 bg-white p-8 ">
        <h2 className="mb-6 text-center text-2xl font-bold text-blue-900 ">
          Sign In
        </h2>
        <p className="mb-6 text-center text-sm text-blue-500 ">
          Configure an auth provider in{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5 text-xs ">
            src/lib/auth.ts
          </code>{" "}
          to enable sign-in.
        </p>
        {/* Auth provider buttons will go here once configured */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-blue-500 hover:text-blue-900 :text-white"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
