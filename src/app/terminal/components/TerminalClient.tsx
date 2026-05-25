"use client";

import { useMemo, useState, useTransition } from "react";
import { ScanLine, LogIn, LogOut, X } from "lucide-react";
import {
  lookupWorkOrder,
  scanIn,
  scanOut,
  getOpenScans,
  type ScanOutPayload,
} from "../actions";
import WeldingForm from "./WeldingForm";
import SprayForm from "./SprayForm";
import MachiningForm from "./MachiningForm";

type Support = {
  employees: { id: string; name: string; code: string }[];
  weldingMachines: any[];
  machiningMachines: any[];
  materialTypes: any[];
  weldingTypes: any[];
  joints: any[];
  elcometers: any[];
};

type Mode = "IN" | "OUT";

export default function TerminalClient({ support }: { support: Support }) {
  const [woNo, setWoNo] = useState("");
  const [wo, setWo] = useState<any>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [mode, setMode] = useState<Mode>("IN");
  const [isPending, startTransition] = useTransition();

  // IN form state
  const [inForm, setInForm] = useState({
    inProcessId: "",
    mainProcessId: "",
    routingProcessProfileId: "",
    employeeId: "",
  });

  // OUT state
  const [openScans, setOpenScans] = useState<any[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string>("");
  const [completedQty, setCompletedQty] = useState<string>("");
  const [machineCodes, setMachineCodes] = useState<string>("");
  const [welding, setWelding] = useState<any>({});
  const [spray, setSpray] = useState<any>({});
  const [machining, setMachining] = useState<any>({});

  const selectedScan = useMemo(
    () => openScans.find((s) => s.id === selectedScanId),
    [openScans, selectedScanId],
  );
  const flags = selectedScan?.routingProcess?.routingProcess
    ? {
        welding: !!selectedScan.routingProcess.routingProcess.welding,
        spray: !!selectedScan.routingProcess.routingProcess.sprayPainting,
        machining: !!selectedScan.routingProcess.routingProcess.machining,
      }
    : null;

  // In-process options derived from the WO
  const inProcessOptions = wo?.inProcesses ?? [];
  const selectedInProcess = inProcessOptions.find((ip: any) => ip.id === inForm.inProcessId);
  const mainProcessOptions = useMemo(() => {
    const seen = new Map<string, { id: string; label: string }>();
    selectedInProcess?.routingProcesses.forEach((rp: any) => {
      if (rp.mainProcess && !seen.has(rp.mainProcess.id)) {
        seen.set(rp.mainProcess.id, { id: rp.mainProcess.id, label: rp.mainProcess.process });
      }
    });
    return Array.from(seen.values());
  }, [selectedInProcess]);
  const routingProcessOptions = useMemo(() => {
    const seen = new Map<string, { id: string; label: string }>();
    selectedInProcess?.routingProcesses
      .filter((rp: any) => rp.mainProcessId === inForm.mainProcessId)
      .forEach((rp: any) => {
        if (rp.routingProcess && !seen.has(rp.routingProcess.id)) {
          seen.set(rp.routingProcess.id, {
            id: rp.routingProcess.id,
            label: rp.routingProcess.routingProcess,
          });
        }
      });
    return Array.from(seen.values());
  }, [selectedInProcess, inForm.mainProcessId]);

  function clearMessages() {
    setError("");
    setInfo("");
  }

  function reset() {
    setWoNo("");
    setWo(null);
    setMode("IN");
    setInForm({ inProcessId: "", mainProcessId: "", routingProcessProfileId: "", employeeId: "" });
    setOpenScans([]);
    setSelectedScanId("");
    setCompletedQty("");
    setMachineCodes("");
    setWelding({});
    setSpray({});
    setMachining({});
    clearMessages();
  }

  function lookup() {
    clearMessages();
    if (!woNo.trim()) return;
    startTransition(async () => {
      const res = await lookupWorkOrder(woNo.trim());
      if (!res.ok) {
        setError(res.error);
        setWo(null);
        return;
      }
      setWo(res.wo);
      const open = await getOpenScans(res.wo.workOrderNo);
      setOpenScans(open);
    });
  }

  function doScanIn() {
    clearMessages();
    if (!inForm.inProcessId || !inForm.mainProcessId || !inForm.routingProcessProfileId || !inForm.employeeId) {
      setError("Select in-process, main process, routing process, and employee");
      return;
    }
    startTransition(async () => {
      const res = await scanIn({ workOrderNo: wo.workOrderNo, ...inForm });
      if (!res.success) {
        setError(res.error || "Scan IN failed");
        return;
      }
      setInfo(`Scanned IN on routing SN ${res.routingSn}`);
      // Refresh open scans + WO state
      const refreshed = await lookupWorkOrder(wo.workOrderNo);
      if (refreshed.ok) setWo(refreshed.wo);
      const open = await getOpenScans(wo.workOrderNo);
      setOpenScans(open);
      setInForm({ inProcessId: "", mainProcessId: "", routingProcessProfileId: "", employeeId: "" });
    });
  }

  function doScanOut() {
    clearMessages();
    if (!selectedScanId) {
      setError("Select an open scan to close");
      return;
    }
    if (!completedQty || Number(completedQty) <= 0) {
      setError("Enter completed quantity");
      return;
    }

    const payload: ScanOutPayload = {
      timesheetId: selectedScanId,
      completedQty: Number(completedQty),
      machineCodes: machineCodes || undefined,
    };
    if (flags?.welding) payload.welding = welding;
    if (flags?.spray) payload.spray = spray;
    if (flags?.machining) payload.machining = machining;

    startTransition(async () => {
      const res = await scanOut(payload);
      if (!res.success) {
        setError(res.error || "Scan OUT failed");
        return;
      }
      setInfo("Scanned OUT successfully");
      setSelectedScanId("");
      setCompletedQty("");
      setMachineCodes("");
      setWelding({});
      setSpray({});
      setMachining({});
      const refreshed = await lookupWorkOrder(wo.workOrderNo);
      if (refreshed.ok) setWo(refreshed.wo);
      const open = await getOpenScans(wo.workOrderNo);
      setOpenScans(open);
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      {/* LEFT: scan flow */}
      <div className="bg-white/80 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ScanLine size={20} className="text-blue-400" />
          <input
            value={woNo}
            onChange={(e) => setWoNo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="Scan or type Work Order No (e.g. 800003-1-1)"
            className="flex-1 px-3 py-2 border border-blue-200 rounded-xl text-sm bg-white text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 shadow-inner placeholder:text-slate-500 transition-all"
            autoFocus
          />
          <button
            onClick={lookup}
            disabled={isPending}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            Lookup
          </button>
          {wo && (
            <button onClick={reset} className="px-3 py-2 text-slate-500 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-full transition-all" title="Clear">
              <X size={18} />
            </button>
          )}
        </div>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 shadow-sm p-3 rounded-lg text-sm">{error}</div>}
        {info && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm p-3 rounded-lg text-sm">{info}</div>}

        {wo && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("IN")}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${
                  mode === "IN" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <LogIn size={16} /> Scan IN
              </button>
              <button
                onClick={() => setMode("OUT")}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${
                  mode === "OUT" ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <LogOut size={16} /> Scan OUT
              </button>
            </div>

            {mode === "IN" ? (
              <div className="space-y-3">
                <Select
                  label="In-Process"
                  value={inForm.inProcessId}
                  onChange={(v) =>
                    setInForm({ inProcessId: v, mainProcessId: "", routingProcessProfileId: "", employeeId: inForm.employeeId })
                  }
                  options={inProcessOptions.map((ip: any) => ({ id: ip.id, label: `${ip.sn}. ${ip.description}` }))}
                />
                <Select
                  label="Main Process"
                  value={inForm.mainProcessId}
                  onChange={(v) => setInForm({ ...inForm, mainProcessId: v, routingProcessProfileId: "" })}
                  options={mainProcessOptions}
                  disabled={!inForm.inProcessId}
                />
                <Select
                  label="Routing Process"
                  value={inForm.routingProcessProfileId}
                  onChange={(v) => setInForm({ ...inForm, routingProcessProfileId: v })}
                  options={routingProcessOptions}
                  disabled={!inForm.mainProcessId}
                />
                <Select
                  label="Employee"
                  value={inForm.employeeId}
                  onChange={(v) => setInForm({ ...inForm, employeeId: v })}
                  options={support.employees.map((e) => ({ id: e.id, label: `${e.name} (${e.code})` }))}
                />
                <button
                  onClick={doScanIn}
                  disabled={isPending}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                >
                  {isPending ? "Scanning..." : "SCAN IN"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500">Open Scans</label>
                  {openScans.length === 0 ? (
                    <div className="mt-1 p-3 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500 bg-slate-50">
                      No open scans for this WO.
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1.5">
                      {openScans.map((s) => (
                        <label
                          key={s.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            selectedScanId === s.id ? "border-amber-400 bg-amber-50 shadow-inner ring-1 ring-amber-400" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={selectedScanId === s.id}
                            onChange={() => setSelectedScanId(s.id)}
                          />
                          <div className="text-xs">
                            <div className="font-medium text-slate-800">
                              {s.employee.name} — {s.routingProcess.routingProcess?.routingProcess ?? "?"}
                            </div>
                            <div className="text-slate-500">
                              {s.routingProcess.inProcess.sn}. {s.routingProcess.inProcess.description}
                              {" · "}
                              IN: {new Date(s.timeIn).toLocaleTimeString()}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {selectedScan && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500">Completed Qty *</label>
                        <input
                          type="number"
                          step="1"
                          value={completedQty}
                          onChange={(e) => setCompletedQty(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-slate-600 rounded-lg text-sm bg-slate-900 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500">Machine Code(s)</label>
                        <input
                          value={machineCodes}
                          onChange={(e) => setMachineCodes(e.target.value)}
                          placeholder="comma-separated"
                          className="mt-1 w-full px-3 py-2 border border-slate-600 rounded-lg text-sm bg-slate-900 text-slate-800"
                        />
                      </div>
                    </div>

                    {flags?.welding && (
                      <div className="border-t border-slate-200 pt-4">
                        <h4 className="text-sm font-semibold text-blue-600 mb-3">Welding Parameters</h4>
                        <WeldingForm
                          value={welding}
                          onChange={setWelding}
                          weldingMachines={support.weldingMachines}
                          materialTypes={support.materialTypes}
                          weldingTypes={support.weldingTypes}
                          joints={support.joints}
                        />
                      </div>
                    )}
                    {flags?.spray && (
                      <div className="border-t border-slate-200 pt-4">
                        <h4 className="text-sm font-semibold text-blue-600 mb-3">Spray Painting Parameters</h4>
                        <SprayForm value={spray} onChange={setSpray} />
                      </div>
                    )}
                    {flags?.machining && (
                      <div className="border-t border-slate-200 pt-4">
                        <h4 className="text-sm font-semibold text-blue-600 mb-3">Machining Parameters</h4>
                        <MachiningForm
                          value={machining}
                          onChange={setMachining}
                          machiningMachines={support.machiningMachines}
                        />
                      </div>
                    )}

                    <button
                      onClick={doScanOut}
                      disabled={isPending}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all"
                    >
                      {isPending ? "Saving..." : "OK to SCAN OUT"}
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* RIGHT: WO summary */}
      <aside className="bg-white/80 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl rounded-2xl p-6 h-fit">
        <h3 className="text-sm font-semibold text-blue-900 mb-3 uppercase tracking-wide">Work Order</h3>
        {!wo ? (
          <p className="text-xs text-slate-500">Scan a work order to begin.</p>
        ) : (
          <div className="space-y-2 text-sm">
            <Pair label="WO No" value={wo.workOrderNo} mono />
            <Pair label="Status" value={wo.status} />
            <Pair label="Customer" value={wo.customer?.customerName} />
            <Pair label="Job" value={wo.jobDescription} />
            <Pair label="Quantity" value={`${wo.quantity ?? "-"} ${wo.uom ?? ""}`} />
            <Pair
              label="Delivery"
              value={wo.deliveryDate ? wo.deliveryDate.slice(0, 10) : "-"}
            />
            <Pair label="Project" value={wo.projectCode} />

            <div className="pt-3 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">In-Process</h4>
              <ul className="space-y-1.5">
                {wo.inProcesses.map((ip: any) => (
                  <li key={ip.id} className="text-xs">
                    <div className="font-medium text-slate-800">
                      {ip.sn}. {ip.description}
                    </div>
                    <div className="text-slate-500">
                      {ip.routingProcesses.length} routing • Target {ip.targetCompletionDate.slice(0, 10)}
                    </div>
                  </li>
                ))}
                {wo.inProcesses.length === 0 && (
                  <li className="text-xs text-slate-500">No in-process steps planned.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Pair({ label, value, mono }: { label: string; value?: any; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm text-slate-800 text-right ${mono ? "font-mono" : ""}`}>
        {value || "-"}
      </span>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full px-3 py-2 border border-slate-600 rounded-lg text-sm bg-slate-900 text-slate-800 disabled:opacity-50"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
