"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDepartmentProfileItem } from "../actions";

export default function NewDepartmentProfilePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createDepartmentProfileItem(formData);
      if (res.success) {
        router.push("/dashboard/master-profile/department");
      } else {
        setErrorMsg(res.error || "Failed to create department profile.");
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-3xl mx-auto w-full bg-blue-50 text-blue-900 ">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/master-profile/department"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-500 hover:text-blue-950 hover:bg-blue-100 hover:border-blue-300 transition-all duration-150"
          title="Back to List"
        >
          <svg className="h-5 w-5 block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-900 ">
            Add Department Profile
          </h1>
          <p className="text-sm text-blue-500 mt-1">
            Create a new department for the master list.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-sm p-6">
        {errorMsg && (
          <div className="mb-6 rounded-lg bg-rose-50 p-4 border border-rose-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-rose-800">Error</h3>
                <div className="mt-1 text-sm text-rose-700 ">
                  {errorMsg}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="department" className="block text-sm font-bold text-blue-900 mb-1.5">
                Department Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                id="department"
                required
                className="block w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-blue-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-colors"
                placeholder="e.g., Laser Cutting"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-blue-100 ">
            <Link
              href="/dashboard/master-profile/department"
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
