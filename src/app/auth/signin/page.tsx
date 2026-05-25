"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    
    const session = await getSession();
    if (session?.user?.role === "PRODUCTION") {
      router.push("/terminal");
    } else {
      router.push(res.url ?? callbackUrl);
    }
    
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-blue-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-blue-900">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function SignIn() {
  return (
    <div className="flex flex-1 items-center justify-center bg-blue-50">
      <div className="w-full max-w-sm rounded-xl border border-blue-200 bg-white p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-blue-900">
          FITPRISE EMS
        </h2>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-900">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
