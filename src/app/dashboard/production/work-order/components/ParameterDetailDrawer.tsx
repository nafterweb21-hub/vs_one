"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  welding?: any;
  spray?: any;
  machining?: any;
};

export default function ParameterDetailDrawer({ welding, spray, machining }: Props) {
  const [isOpen, setOpen] = useState(false);
  const has = welding || spray || machining;
  if (!has) return <span className="text-slate-400 text-xs">None</span>;

  const type = welding ? "Welding" : spray ? "Spray Painting" : "Machining";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium"
      >
        View Detail
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800">Process Parameter — {type}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-200 rounded-md text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {welding && <WeldingDetail data={welding} />}
              {spray && <SprayDetail data={spray} />}
              {machining && <MachiningDetail data={machining} />}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value }: { label: string; value?: any }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 px-3 py-1.5 border border-slate-100 rounded text-sm bg-slate-50 text-slate-700 min-h-[34px]">
        {value == null || value === "" ? "-" : String(value)}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 pb-1 border-b border-slate-100">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

function WeldingDetail({ data }: { data: any }) {
  return (
    <>
      <Section title="Materials & Type">
        <Field label="Type of Material" value={(data.materialTypes ?? []).map((m: any) => m.materialName ?? m.name).join(", ")} />
        <Field label="Type of Welding" value={(data.weldingTypes ?? []).map((w: any) => w.typeName ?? w.name).join(", ")} />
        <Field label="Welding Machine" value={data.weldingMachine?.machineCode ?? data.weldingMachine?.machineName} />
      </Section>
      <Section title="Machine">
        <Field label="Machine No" value={data.weldingMachine?.machineNo} />
        <Field label="Brand" value={data.weldingMachine?.brand} />
        <Field label="Model" value={data.weldingMachine?.model} />
        <Field label="Current" value={data.weldingMachine?.current} />
        <Field label="S/No" value={data.weldingMachine?.serialNo} />
      </Section>
      <Section title="Joint & Process">
        <Field label="Type of Joint" value={data.typeOfJoint?.joint} />
        <Field label="Electrode Type" value={data.electrodeType} />
        <Field label="Welding Position" value={data.weldingPosition} />
        <Field label="Welding Joint" value={data.weldingJoint} />
        <Field label="Welding Size (mm)" value={data.weldingSizeMm} />
      </Section>
      <Section title="Parameters">
        <Field label="Voltage (V)" value={data.voltageVolts} />
        <Field label="Current (A)" value={data.currentAmp} />
        <Field label="Cooling Time (mins)" value={data.coolingTimeMins} />
        <Field label="Pre Heating (°C)" value={data.preHeatingC} />
        <Field label="Post Heating (°C)" value={data.postHeatingC} />
        <Field label="Heat Treatment (HRC)" value={data.heatTreatmentHrc} />
      </Section>
      <Section title="Confirmation">
        <Field label="Status" value={data.status} />
        <Field label="Confirmed By" value={data.confirmedBy?.name} />
        <Field label="Confirmed Date" value={data.confirmedDate ? new Date(data.confirmedDate).toLocaleDateString() : null} />
      </Section>
      <Section title="Remark">
        <Field label="Remark" value={data.remark} />
      </Section>
    </>
  );
}

function SprayDetail({ data }: { data: any }) {
  return (
    <>
      <Section title="Header">
        <Field label="Paint Tank Pressure (psi)" value={data.paintTankPressurePsi} />
        <Field label="Spray Nozzle Size (Ø)" value={data.sprayNozzleSize} />
        <Field label="Type of Paint" value={data.typeOfPaint} />
        <Field label="Remark" value={data.remark} />
      </Section>
      <Section title="A. Surface Preparation">
        <Field label="Start" value={data.surfaceStartDatetime ? new Date(data.surfaceStartDatetime).toLocaleString() : null} />
        <Field label="End" value={data.surfaceEndDatetime ? new Date(data.surfaceEndDatetime).toLocaleString() : null} />
        <Field label="Weather" value={data.surfaceGeneralWeather} />
        <Field label="Env Temp" value={data.surfaceEnvTemperature} />
        <Field label="Humidity" value={data.surfaceRelativeHumidity} />
        <Field label="Abrasive Type" value={data.surfaceAbrasiveType} />
        <Field label="Sandpaper Grit" value={data.surfaceSandpaperGrit} />
      </Section>
      <Section title="B. Primer Coat">
        <Field label="Start" value={data.primerStartDatetime ? new Date(data.primerStartDatetime).toLocaleString() : null} />
        <Field label="End" value={data.primerEndDatetime ? new Date(data.primerEndDatetime).toLocaleString() : null} />
        <Field label="Weather" value={data.primerGeneralWeather} />
        <Field label="Env Temp" value={data.primerEnvTemperature} />
        <Field label="Humidity" value={data.primerRelativeHumidity} />
        <Field label="Paint Batch No" value={data.primerPaintBatchNo} />
        <Field label="Expiry Date" value={data.primerExpiryDate ? new Date(data.primerExpiryDate).toLocaleDateString() : null} />
        <Field label="DFT Measurement" value={data.primerDftMeasurement} />
      </Section>
      <Section title="C. Top Coat">
        <Field label="Start" value={data.topcoatStartDatetime2 ? new Date(data.topcoatStartDatetime2).toLocaleString() : null} />
        <Field label="End" value={data.topcoatEndDatetime2 ? new Date(data.topcoatEndDatetime2).toLocaleString() : null} />
        <Field label="Weather" value={data.topcoatGeneralWeather2} />
        <Field label="Env Temp" value={data.topcoatEnvTemperature2} />
        <Field label="Humidity" value={data.topcoatRelativeHumidity2} />
        <Field label="Paint Batch No" value={data.topcoatPaintBatchNo} />
        <Field label="Expiry Date" value={data.topcoatExpiryDate ? new Date(data.topcoatExpiryDate).toLocaleDateString() : null} />
        <Field label="DFT Measurement" value={data.topcoatDftMeasurement} />
        <Field label="Adhesive Test Result" value={data.topcoatAdhesiveTestResult} />
      </Section>
      <Section title="Confirmation">
        <Field label="Status" value={data.status} />
        <Field label="Elcometer Name" value={data.elcometerName} />
        <Field label="Elcometer Serial No" value={data.elcometer?.serialNo ?? data.elcometer?.elcometerSerialNo} />
        <Field label="Confirmed By" value={data.confirmedBy?.name} />
        <Field label="Confirmed Date" value={data.confirmedDate ? new Date(data.confirmedDate).toLocaleDateString() : null} />
        <Field label="Additional Remark" value={data.additionalRemark} />
      </Section>
    </>
  );
}

function MachiningDetail({ data }: { data: any }) {
  return (
    <>
      <Section title="Machine">
        <Field label="Machine Type" value={data.machine?.machineType} />
        <Field label="Machine Serial No" value={data.machine?.serialNo ?? data.machine?.machineSerialNo} />
        <Field label="Machine No / Name" value={data.machine?.machineNo ?? data.machine?.machineName} />
        <Field label="Brand" value={data.machine?.brand} />
        <Field label="Model" value={data.machine?.model} />
      </Section>
      <Section title="Operation">
        <Field label="Operation Type" value={data.operationType} />
        <Field label="CNC Program No" value={data.cncProgramNo} />
        <Field label="Test Run" value={data.testRun} />
        <Field label="Special Tooling" value={data.specialTooling} />
        <Field label="Part Runtime (Hr)" value={data.partRuntimeHr} />
        <Field label="Part Runtime (Mins)" value={data.partRuntimeMins} />
      </Section>
      <Section title="Tool List">
        <Field label="Tools" value={(data.toolLists ?? []).map((t: any) => t.toolValue).join(", ")} />
      </Section>
      <Section title="Confirmation">
        <Field label="Status" value={data.status} />
        <Field label="Confirmed By" value={data.confirmedBy?.name} />
        <Field label="Confirmed Date" value={data.confirmedDate ? new Date(data.confirmedDate).toLocaleDateString() : null} />
        <Field label="Remark" value={data.remark} />
      </Section>
    </>
  );
}
