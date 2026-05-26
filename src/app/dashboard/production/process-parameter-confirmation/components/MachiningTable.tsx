import { ProcessParameterMachining, ProductionTimesheet, Employee, MachineProfile, MachiningToolList } from "@prisma/client";
import { useState } from "react";
import { X } from "lucide-react";

type ProcessParameterMachiningWithRelations = ProcessParameterMachining & {
  timesheet: ProductionTimesheet & {
    employee: Employee | null;
    routingProcess: any; 
  };
  machine: MachineProfile | null;
  toolLists: MachiningToolList[];
};

// Process Parameter Confirmation - Machining Table Component
export default function MachiningTable({ 
  data, 
  selectedIds, 
  setSelectedIds,
  employees,
  rowSelections,
  setRowSelections
}: { 
  data: ProcessParameterMachiningWithRelations[], 
  selectedIds: string[], 
  setSelectedIds: (ids: string[]) => void,
  employees: any[],
  rowSelections: Record<string, any>,
  setRowSelections: React.Dispatch<React.SetStateAction<Record<string, any>>>
}) {
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [selectedTools, setSelectedTools] = useState<MachiningToolList[]>([]);

  const handleOpenToolModal = (tools: MachiningToolList[]) => {
    setSelectedTools(tools);
    setIsToolModalOpen(true);
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map((row) => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="relative">
      <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th scope="col" className="p-4 w-4 bg-gray-50 sticky left-0 z-20">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={data.length > 0 && selectedIds.length === data.length}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-semibold text-gray-700">Select</span>
              </div>
            </th>
            <th scope="col" className="px-4 py-3 bg-gray-50 sticky left-12 z-20">Confirmed By</th>
            <th scope="col" className="px-4 py-3">Work Order No</th>
            <th scope="col" className="px-4 py-3">Customer</th>
            <th scope="col" className="px-4 py-3">Customer PO Ref</th>
            <th scope="col" className="px-4 py-3">Job Description</th>
            <th scope="col" className="px-4 py-3">Quantity</th>
            <th scope="col" className="px-4 py-3">UOM</th>
            <th scope="col" className="px-4 py-3">Employee</th>
            <th scope="col" className="px-4 py-3">Time IN</th>
            <th scope="col" className="px-4 py-3">Time OUT</th>
            <th scope="col" className="px-4 py-3">Machine Type</th>
            <th scope="col" className="px-4 py-3">Machine Serial No</th>
            <th scope="col" className="px-4 py-3">Machine No / Name</th>
            <th scope="col" className="px-4 py-3">Brand</th>
            <th scope="col" className="px-4 py-3">Model</th>
            <th scope="col" className="px-4 py-3">Operation Type</th>
            <th scope="col" className="px-4 py-3">CNC Program No</th>
            <th scope="col" className="px-4 py-3">Test Run</th>
            <th scope="col" className="px-4 py-3">Special Tooling</th>
            <th scope="col" className="px-4 py-3">Part Runtime (Hr)</th>
            <th scope="col" className="px-4 py-3">Part Runtime (Mins)</th>
            <th scope="col" className="px-4 py-3">Tool List</th>
            <th scope="col" className="px-4 py-3">Remark</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={24} className="px-4 py-8 text-center text-gray-500">
                No pending machining parameters found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const timesheet = row.timesheet || {};
              const routingProcess = timesheet.routingProcess || {};
              const inProcess = routingProcess.inProcess || {};
              const workOrder = inProcess.workOrder || {};
              
              return (
                <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-4 bg-white sticky left-0 z-10 border-r border-gray-100 group-hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={() => toggleRow(row.id)}
                        checked={selectedIds.includes(row.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 bg-white sticky left-12 z-10 border-r border-gray-100 group-hover:bg-gray-50">
                    <select
                      value={rowSelections[row.id]?.confirmedById || ""}
                      onChange={(e) => setRowSelections(prev => ({ ...prev, [row.id]: { ...prev[row.id], confirmedById: e.target.value } }))}
                      className="w-40 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 bg-white border-r border-gray-100 group-hover:bg-gray-50">
                    {workOrder.workOrderNo || "-"}
                  </td>
                  <td className="px-4 py-2">{workOrder.customer?.customerName || "-"}</td>
                  <td className="px-4 py-2">{workOrder.customerPoRef || "-"}</td>
                  <td className="px-4 py-2">{inProcess.description || "-"}</td>
                  <td className="px-4 py-2">{workOrder.quantity ? Number(workOrder.quantity).toString() : "-"}</td>
                  <td className="px-4 py-2">{workOrder.uom || "-"}</td>
                  <td className="px-4 py-2">{timesheet.employee?.name || "-"}</td>
                  <td className="px-4 py-2">{timesheet.timeIn ? new Date(timesheet.timeIn).toLocaleString() : "-"}</td>
                  <td className="px-4 py-2">{timesheet.timeOut ? new Date(timesheet.timeOut).toLocaleString() : "-"}</td>
                  
                  <td className="px-4 py-2">{row.machine?.machineType || "-"}</td>
                  <td className="px-4 py-2">{row.machine?.serialNo || "-"}</td>
                  <td className="px-4 py-2">{row.machine?.machineNo || "-"}</td>
                  <td className="px-4 py-2">{row.machine?.brand || "-"}</td>
                  <td className="px-4 py-2">{row.machine?.model || "-"}</td>
                  <td className="px-4 py-2">{row.machine?.operationType || "-"}</td>
                  
                  <td className="px-4 py-2">{row.cncProgramNo || "-"}</td>
                  <td className="px-4 py-2">{row.testRun || "-"}</td>
                  <td className="px-4 py-2">{row.specialTooling || "-"}</td>
                  <td className="px-4 py-2">{row.partRuntimeHr?.toString() || "-"}</td>
                  <td className="px-4 py-2">{row.partRuntimeMins?.toString() || "-"}</td>
                  <td 
                    className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleOpenToolModal(row.toolLists || [])}
                  >
                    {row.toolLists?.length ? `${row.toolLists.length} Tools` : "-"}
                  </td>
                  <td className="px-4 py-2">{row.remark || "-"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {isToolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg text-gray-900">Process Parameter Confirmation – Machining – Tool List</h3>
              <button 
                onClick={() => setIsToolModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {selectedTools.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tools available.</p>
              ) : (
                <table className="min-w-full text-sm text-left text-gray-600 border border-gray-200">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 w-16 border-r border-gray-200">SN</th>
                      <th className="px-4 py-3">Tool List</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTools.map((tool, idx) => (
                      <tr key={tool.id} className="border-b border-gray-100 last:border-none">
                        <td className="px-4 py-2 border-r border-gray-100">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium text-gray-900">{tool.toolValue?.toString() || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsToolModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
