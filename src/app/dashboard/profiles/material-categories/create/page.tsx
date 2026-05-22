"use client";

import React from "react";
import MaterialCategoryForm from "../components/MaterialCategoryForm";

export default function CreateMaterialCategoryPage() {
  return (
    <div className="space-y-6 animate-fade-in relative min-h-screen">
      
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <a href="/dashboard/profiles" className="hover:underline">Master Profiles</a>
          <span>/</span>
          <a href="/dashboard/profiles/material-categories" className="hover:underline">Material Category Profile</a>
          <span>/</span>
          <span>Create New Category</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Create Material Category
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Configure a new material category to be used across material profile catalogs.
        </p>
      </div>

      <MaterialCategoryForm editingProfile={null} />

    </div>
  );
}
