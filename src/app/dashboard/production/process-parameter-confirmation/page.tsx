"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle, Search, Loader2 } from "lucide-react";
import WeldingTable from "./components/WeldingTable";
import SprayPaintingTable from "./components/SprayPaintingTable";
import MachiningTable from "./components/MachiningTable";

type Tab = "welding" | "sprayPainting" | "machining";

export default function ProcessParameterConfirmation() {
  const [activeTab, setActiveTab] = useState<Tab>("welding");
  const [data, setData] = useState({ welding: [], sprayPainting: [], machining: [] });
  const [loading, setLoading] = useState(true);
  
  // Selections state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Action state
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [elcometers, setElcometers] = useState<{ id: string; serialNo: string }[]>([]);
  const [rowSelections, setRowSelections] = useState<Record<string, { confirmedById?: string; elcometerId?: string }>>({});
  const [confirming, setConfirming] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/production/process-parameter-confirmation");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Failed to load pending process parameters.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [empRes, elcoRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/profiles/elcometer")
      ]);
      if (empRes.ok) {
        const json = await empRes.json();
        // Fallback to json if json.employees is undefined (depends on API structure)
        setEmployees(json.employees || json || []);
      }
      if (elcoRes.ok) {
        const json = await elcoRes.json();
        setElcometers(json.profiles || json || []);
      }
    } catch (e) {
      console.error("Failed to fetch dropdowns", e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedIds([]); // Clear selection when switching tabs
  };

  const handleConfirm = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record to confirm.");
      return;
    }
    
    // Validate that all selected rows have a "Confirmed By" value
    const missingConfirmBy = selectedIds.some(id => !rowSelections[id]?.confirmedById);
    if (missingConfirmBy) {
      toast.error("Please select 'Confirmed By' for all selected records.");
      return;
    }

    const updates = selectedIds.map(id => ({
      id,
      confirmedById: rowSelections[id]?.confirmedById,
      elcometerSerialNoId: rowSelections[id]?.elcometerId
    }));

    setConfirming(true);
    try {
      const res = await fetch("/api/production/process-parameter-confirmation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          updates
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to confirm.");
      }

      toast.success("Process parameters confirmed successfully!");
      setSelectedIds([]);
      // Clear selections for confirmed rows
      setRowSelections(prev => {
        const next = { ...prev };
        selectedIds.forEach(id => delete next[id]);
        return next;
      });
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Process Parameter Confirmation</h1>
          <p className="text-sm text-gray-500 mt-1">Review and confirm pending process parameters from production.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange("welding")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "welding" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Welding
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
              {data.welding?.length || 0}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("sprayPainting")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "sprayPainting" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Spray Painting
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
              {data.sprayPainting?.length || 0}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("machining")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "machining" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Machining
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
              {data.machining?.length || 0}
            </span>
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-end gap-4">
          
          <button
            onClick={handleConfirm}
            disabled={confirming || selectedIds.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {confirming ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Confirm
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === "welding" && (
                <WeldingTable data={data.welding} selectedIds={selectedIds} setSelectedIds={setSelectedIds} employees={employees} rowSelections={rowSelections} setRowSelections={setRowSelections} />
              )}
              {activeTab === "sprayPainting" && (
                <SprayPaintingTable data={data.sprayPainting} selectedIds={selectedIds} setSelectedIds={setSelectedIds} employees={employees} elcometers={elcometers} rowSelections={rowSelections} setRowSelections={setRowSelections} />
              )}
              {activeTab === "machining" && (
                <MachiningTable data={data.machining} selectedIds={selectedIds} setSelectedIds={setSelectedIds} employees={employees} rowSelections={rowSelections} setRowSelections={setRowSelections} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
