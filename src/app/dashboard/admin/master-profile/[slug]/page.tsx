"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Building2, 
  Users, 
  Receipt, 
  Briefcase, 
  FileSignature, 
  Layers,
  Clock,
  Sparkles,
  Database,
  Search,
  ThumbsUp,
  Plus,
  Trash2,
  HelpCircle,
  ArrowLeft
} from "lucide-react";
import { masterProfiles } from "@/lib/profiles";

export default function DynamicProfileRoadmapPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Find the profile config
  const profile = useMemo(() => {
    return masterProfiles.find((p) => p.slug === slug);
  }, [slug]);

  // Declare all hooks first to conform to rules-of-hooks, with fallbacks
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotes, setUpvotes] = useState(() => Math.floor(Math.random() * 80) + 12);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [simulatedRows, setSimulatedRows] = useState<Record<string, string>[]>(() => profile?.mockRows || []);
  const [showAddSimForm, setShowAddSimForm] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});

  // Helper to resolve icon component
  const IconComponent = useMemo(() => {
    if (!profile) return Layers;
    switch (profile.iconKey) {
      case "company": return Building2;
      case "employee": return Users;
      case "approval": return FileSignature;
      case "tax":
      case "currency":
      case "payment":
        return Receipt;
      case "customer":
      case "supplier":
        return Briefcase;
      default:
        return Layers;
    }
  }, [profile]);

  // If company or not found, handle early return AFTER hooks declaration
  if (!profile || profile.slug === "company") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-950 min-h-screen">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile Not Found</h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          The requested master profile configuration was not found or is handled by a static page.
        </p>
        <Link 
          href="/dashboard/admin/master-profile" 
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  // Handle upvote interaction
  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    }
  };

  // Filtered rows for search simulation
  const filteredRows = queryFilter(simulatedRows, searchQuery);

  // Add simulated row
  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we fill missing fields with defaults
    const completeRow: Record<string, string> = {};
    profile.mockFields.forEach((field) => {
      completeRow[field] = newRowData[field] || "Simulated Data";
    });

    setSimulatedRows(prev => [completeRow, ...prev]);
    setNewRowData({});
    setShowAddSimForm(false);
  };

  // Delete simulated row
  const handleDeleteRow = (index: number) => {
    setSimulatedRows(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/20">
      
      {/* Main Workspace Body */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* Profile Hero Block */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-150/40 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 w-36 h-36 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shrink-0 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
                  <IconComponent className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {profile.title}
                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 rounded-md">
                      Roadmap Spec
                    </span>
                  </h1>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl">
                    {profile.description}
                  </p>
                  
                  {/* Phase & Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                      <Clock className="w-3 h-3" />
                      {profile.roadmapPhase}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      profile.complexity === "High"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400"
                        : profile.complexity === "Medium"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400"
                    }`}>
                      Complexity: {profile.complexity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upvote Interactive Counter */}
              <div className="flex-shrink-0 flex items-center gap-4 bg-blue-50/20 dark:bg-slate-900/40 p-4 rounded-xl border border-blue-100/40 dark:border-slate-800">
                <div className="text-right">
                  <span className="block text-2xl font-black text-blue-600 dark:text-blue-450">{upvotes}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wide uppercase">Request Votes</span>
                </div>
                <button
                  onClick={handleUpvote}
                  disabled={hasUpvoted}
                  className={`flex h-10 px-4 items-center gap-2 rounded-xl font-bold text-xs transition-all duration-200 shadow-md shadow-blue-500/10 ${
                    hasUpvoted
                      ? "bg-emerald-500 text-white cursor-default shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? "animate-bounce" : ""}`} />
                  {hasUpvoted ? "Requested" : "Upvote Feature"}
                </button>
              </div>
            </div>
          </div>

          {/* Double Column View */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Left/Middle Columns: Table Preview Simulation */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-blue-150/40 bg-white shadow-sm overflow-hidden flex flex-col h-full min-h-[400px] dark:border-slate-800 dark:bg-slate-900">
                
                {/* Simulated Table Header & Search Controls */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/15 dark:bg-slate-900/40">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-blue-600" />
                      Mock Database Simulation
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450">
                      Simulating active SQL database fields & sample tables.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search mock records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs w-48 rounded-lg border border-blue-100 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    
                    <button
                      onClick={() => setShowAddSimForm(!showAddSimForm)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>
                </div>

                {/* Inline Simulated Add Row Form */}
                {showAddSimForm && (
                  <form onSubmit={handleAddRow} className="p-4 bg-blue-50/20 dark:bg-blue-950/10 border-b border-slate-100 dark:border-slate-850 animate-slide-in space-y-3">
                    <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400">Simulate New Row Entry</h4>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {profile.mockFields.map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            {field}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={`Enter ${field}`}
                            value={newRowData[field] || ""}
                            onChange={(e) => setNewRowData(prev => ({ ...prev, [field]: e.target.value }))}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-blue-100 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddSimForm(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-850 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Insert simulated row
                      </button>
                    </div>
                  </form>
                )}

                {/* Simulated Table Data */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-blue-50/35 dark:bg-slate-950 text-[10px] font-bold text-blue-900/90 dark:text-blue-300 uppercase tracking-wider">
                        <th className="px-4 py-3 w-12 text-center border-r border-slate-100 dark:border-slate-850">S/N</th>
                        {profile.mockFields.map((field) => (
                          <th key={field} className="px-4 py-3">{field}</th>
                        ))}
                        <th className="px-4 py-3 w-16 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {filteredRows.length > 0 ? (
                        filteredRows.map((row, index) => (
                          <tr key={index} className="hover:bg-blue-50/20 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350">
                            <td className="px-4 py-3 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 border-r border-slate-100 dark:border-slate-800">
                              {filteredRows.length - index}
                            </td>
                            {profile.mockFields.map((field) => (
                              <td key={field} className="px-4 py-3 font-medium">
                                {row[field] || "—"}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteRow(index)}
                                className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                                title="Remove simulated row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={profile.mockFields.length + 2} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                            No records found. Click &quot;Add Row&quot; to simulate database models.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Schema Metadata Footer */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-blue-50/15 dark:bg-slate-900/40 text-[10px] text-slate-450 dark:text-slate-500 font-semibold flex items-center justify-between">
                  <span>Target Schema Model: <code className="bg-white/80 dark:bg-slate-950/65 px-1 py-0.5 rounded border border-blue-50/10">Model {profile.title.replace(/\s+/g, '')}</code></span>
                  <span>Active Rows Simulated: {simulatedRows.length}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Roadmap Progression Specs */}
            <div className="space-y-6">
              
              {/* Specification Card */}
              <div className="rounded-xl border border-blue-150/40 bg-white p-5 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Function Specifications
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">
                    Technical definition and design attributes.
                  </p>
                </div>
                
                <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  <div className="p-3 bg-blue-50/10 dark:bg-slate-950 rounded-lg space-y-2 border border-blue-100/30 dark:border-slate-850">
                    <p className="font-bold text-[11px] text-blue-800 dark:text-blue-300">Intended Logic &amp; Flow:</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <li>Strict relational constraints linked directly to core tables.</li>
                      <li>Standardized import/export validation filters.</li>
                      <li>Audit trailing recording creation details automatically.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <div className="p-2.5 rounded-lg bg-blue-50/5 dark:bg-slate-950 border border-blue-100/10 dark:border-slate-850 text-center">
                      <span className="block text-[9px] uppercase text-slate-400 font-bold mb-0.5">DB Adapter</span>
                      <span className="text-slate-800 dark:text-slate-200">Prisma PostgreSQL</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50/5 dark:bg-slate-950 border border-blue-100/10 dark:border-slate-850 text-center">
                      <span className="block text-[9px] uppercase text-slate-400 font-bold mb-0.5">API Layer</span>
                      <span className="text-slate-800 dark:text-slate-200">Server Actions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roadmap Phase Timeline */}
              <div className="rounded-xl border border-blue-150/40 bg-white p-5 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-650" />
                    Integration Roadmap
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">
                    Scheduled deployment phases &amp; progress.
                  </p>
                </div>

                {/* Timeline flow */}
                <div className="space-y-4 relative pl-4 border-l border-slate-200 dark:border-slate-800 text-xs">
                  {/* Step 1 */}
                  <div className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-600 shadow-md shadow-blue-500/50" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Phase 1: DB &amp; Architecture (Active)</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Core company profile schema and API storage set up.</p>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-400 shadow-md shadow-blue-300/40" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Phase 2: Core Master Profiles (Planned)</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Implementation of Employee, Customer, Supplier, and Materials.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative space-y-0.5 opacity-60">
                    <div className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-700" />
                    <h4 className="font-bold text-slate-400 dark:text-slate-550">Phase 3: Extended Operations (Scheduled)</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-555">Integration of Machine Calibration, Joint Types, and QC Gauges.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

// Search helper function
function queryFilter(rows: Record<string, string>[], searchQuery: string) {
  if (!searchQuery) return rows;
  const query = searchQuery.toLowerCase();
  return rows.filter((row) => 
    Object.values(row).some((val) => val.toLowerCase().includes(query))
  );
}
