export default function WeldingTable({ data, selectedIds, setSelectedIds, employees, rowSelections, setRowSelections }: { data: any[], selectedIds: string[], setSelectedIds: (ids: string[]) => void, employees: any[], rowSelections: Record<string, any>, setRowSelections: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {
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
          <th scope="col" className="px-4 py-3">Type of Material</th>
          <th scope="col" className="px-4 py-3">Type of Welding</th>
          <th scope="col" className="px-4 py-3">Welding Machine</th>
          <th scope="col" className="px-4 py-3">Machine No</th>
          <th scope="col" className="px-4 py-3">Brand</th>
          <th scope="col" className="px-4 py-3">Model</th>
          <th scope="col" className="px-4 py-3">Current</th>
          <th scope="col" className="px-4 py-3">S/No</th>
          <th scope="col" className="px-4 py-3">Type of Joint</th>
          <th scope="col" className="px-4 py-3">Electrode Type</th>
          <th scope="col" className="px-4 py-3">Welding Position</th>
          <th scope="col" className="px-4 py-3">Welding Joint</th>
          <th scope="col" className="px-4 py-3">Welding Size (mm)</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={30} className="px-4 py-8 text-center text-gray-500">
              No pending welding parameters found.
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
                
                {/* Many to many relation materialTypes */}
                <td className="px-4 py-2">{row.materialTypes?.map((m: any) => m.type).join(", ") || "-"}</td>
                <td className="px-4 py-2">{row.weldingTypes?.map((w: any) => w.type).join(", ") || "-"}</td>
                
                <td className="px-4 py-2">{row.weldingMachine?.machineCategory || "-"}</td>
                <td className="px-4 py-2">{row.weldingMachine?.machineNo || "-"}</td>
                <td className="px-4 py-2">{row.weldingMachine?.brand || "-"}</td>
                <td className="px-4 py-2">{row.weldingMachine?.model || "-"}</td>
                <td className="px-4 py-2">{row.weldingMachine?.current || "-"}</td>
                <td className="px-4 py-2">{row.weldingMachine?.serialNo || "-"}</td>
                
                <td className="px-4 py-2">{row.typeOfJoint?.joint || "-"}</td>
                <td className="px-4 py-2">{row.electrodeType || "-"}</td>
                <td className="px-4 py-2">{row.weldingPosition || "-"}</td>
                <td className="px-4 py-2">{row.weldingJoint?.toString() || "-"}</td>
                <td className="px-4 py-2">{row.weldingSizeMm?.toString() || "-"}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
