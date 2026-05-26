export default function SprayPaintingTable({ data, selectedIds, setSelectedIds, employees, elcometers, rowSelections, setRowSelections }: { data: any[], selectedIds: string[], setSelectedIds: (ids: string[]) => void, employees: any[], elcometers: any[], rowSelections: Record<string, any>, setRowSelections: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {
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
          <th scope="col" className="px-4 py-3 bg-gray-50 sticky left-12 z-20">Elcometer Serial No</th>
          <th scope="col" className="px-4 py-3 bg-gray-50 sticky left-[200px] z-20">Confirmed By</th>
          <th scope="col" className="px-4 py-3">Work Order No</th>
          <th scope="col" className="px-4 py-3">Customer</th>
          <th scope="col" className="px-4 py-3">Customer PO Ref</th>
          <th scope="col" className="px-4 py-3">Job Description</th>
          <th scope="col" className="px-4 py-3">Quantity</th>
          <th scope="col" className="px-4 py-3">UOM</th>
          <th scope="col" className="px-4 py-3">Employee</th>
          <th scope="col" className="px-4 py-3">Time IN</th>
          <th scope="col" className="px-4 py-3">Time OUT</th>
          <th scope="col" className="px-4 py-3">Paint Tank Pressure (Psi)</th>
          <th scope="col" className="px-4 py-3">Spray Nozzle Size (Ø)</th>
          <th scope="col" className="px-4 py-3">Type of Paint</th>
          <th scope="col" className="px-4 py-3">Remark</th>
          
          <th scope="col" className="px-4 py-3 bg-blue-50 border-l border-blue-100">Start Date Time</th>
          <th scope="col" className="px-4 py-3 bg-blue-50">End Date Time</th>
          <th scope="col" className="px-4 py-3 bg-blue-50">General Weather Condition</th>
          <th scope="col" className="px-4 py-3 bg-blue-50">Environmental Temperature</th>
          <th scope="col" className="px-4 py-3 bg-blue-50">Relative Humidity</th>
          <th scope="col" className="px-4 py-3 bg-blue-50">Abrasive Type</th>
          <th scope="col" className="px-4 py-3 bg-blue-50">Sandpaper Grit</th>
          
          <th scope="col" className="px-4 py-3 bg-green-50 border-l border-green-100">Start Date Time</th>
          <th scope="col" className="px-4 py-3 bg-green-50">End Date Time</th>
          <th scope="col" className="px-4 py-3 bg-green-50">General Weather Condition</th>
          <th scope="col" className="px-4 py-3 bg-green-50">Environmental Temperature</th>
          <th scope="col" className="px-4 py-3 bg-green-50">Relative Humidity</th>
          <th scope="col" className="px-4 py-3 bg-green-50">Paint Batch No</th>
          <th scope="col" className="px-4 py-3 bg-green-50">Expiry Date</th>
          <th scope="col" className="px-4 py-3 bg-green-50">DFT Measurement Result</th>
          
          <th scope="col" className="px-4 py-3 bg-orange-50 border-l border-orange-100">Start Date Time</th>
          <th scope="col" className="px-4 py-3 bg-orange-50">End Date Time</th>
          <th scope="col" className="px-4 py-3 bg-orange-50">General Weather Condition</th>
          <th scope="col" className="px-4 py-3 bg-orange-50">Environmental Temperature</th>
          <th scope="col" className="px-4 py-3 bg-orange-50">Relative Humidity</th>
          <th scope="col" className="px-4 py-3 bg-orange-50">Abrasive Type</th>
          <th scope="col" className="px-4 py-3 bg-orange-50">Sandpaper Grit</th>
          
          <th scope="col" className="px-4 py-3 bg-purple-50 border-l border-purple-100">Start Date Time</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">End Date Time</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">General Weather Condition</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">Environmental Temperature</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">Relative Humidity</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">Paint Batch No</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">Expiry Date</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">DFT Measurement Result</th>
          <th scope="col" className="px-4 py-3 bg-purple-50">Adhesive Test Result</th>
          
          <th scope="col" className="px-4 py-3 border-l border-gray-200">Additional Remark</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={48} className="px-4 py-8 text-center text-gray-500">
              No pending spray painting parameters found.
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
                    value={rowSelections[row.id]?.elcometerId || ""}
                    onChange={(e) => setRowSelections(prev => ({ ...prev, [row.id]: { ...prev[row.id], elcometerId: e.target.value } }))}
                    className="w-40 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {elcometers.map((elco) => (
                      <option key={elco.id} value={elco.id}>
                        {elco.serialNo}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 bg-white sticky left-[200px] z-10 border-r border-gray-100 group-hover:bg-gray-50">
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
                
                <td className="px-4 py-2">{row.paintTankPressurePsi?.toString() || "-"}</td>
                <td className="px-4 py-2">{row.sprayNozzleSize?.toString() || "-"}</td>
                <td className="px-4 py-2">{row.typeOfPaint || "-"}</td>
                <td className="px-4 py-2">{row.remark || "-"}</td>
                
                <td className="px-4 py-2 bg-blue-50/30 border-l border-blue-100">{row.surfaceStartDatetime ? new Date(row.surfaceStartDatetime).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-blue-50/30">{row.surfaceEndDatetime ? new Date(row.surfaceEndDatetime).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-blue-50/30">{row.surfaceGeneralWeather || "-"}</td>
                <td className="px-4 py-2 bg-blue-50/30">{row.surfaceEnvTemperature || "-"}</td>
                <td className="px-4 py-2 bg-blue-50/30">{row.surfaceRelativeHumidity || "-"}</td>
                <td className="px-4 py-2 bg-blue-50/30">{row.surfaceAbrasiveType || "-"}</td>
                <td className="px-4 py-2 bg-blue-50/30">{row.surfaceSandpaperGrit || "-"}</td>
                
                <td className="px-4 py-2 bg-green-50/30 border-l border-green-100">{row.primerStartDatetime ? new Date(row.primerStartDatetime).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerEndDatetime ? new Date(row.primerEndDatetime).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerGeneralWeather || "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerEnvTemperature || "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerRelativeHumidity || "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerPaintBatchNo || "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerExpiryDate ? new Date(row.primerExpiryDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2 bg-green-50/30">{row.primerDftMeasurement || "-"}</td>
                
                <td className="px-4 py-2 bg-orange-50/30 border-l border-orange-100">{row.topcoatStartDatetime ? new Date(row.topcoatStartDatetime).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-orange-50/30">{row.topcoatEndDatetime ? new Date(row.topcoatEndDatetime).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-orange-50/30">{row.topcoatGeneralWeather || "-"}</td>
                <td className="px-4 py-2 bg-orange-50/30">{row.topcoatEnvTemperature || "-"}</td>
                <td className="px-4 py-2 bg-orange-50/30">{row.topcoatRelativeHumidity || "-"}</td>
                <td className="px-4 py-2 bg-orange-50/30">{row.topcoatAbrasiveType || "-"}</td>
                <td className="px-4 py-2 bg-orange-50/30">{row.topcoatSandpaperGrit || "-"}</td>
                
                <td className="px-4 py-2 bg-purple-50/30 border-l border-purple-100">{row.topcoatStartDatetime2 ? new Date(row.topcoatStartDatetime2).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatEndDatetime2 ? new Date(row.topcoatEndDatetime2).toLocaleString() : "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatGeneralWeather2 || "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatEnvTemperature2 || "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatRelativeHumidity2 || "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatPaintBatchNo || "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatExpiryDate ? new Date(row.topcoatExpiryDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatDftMeasurement || "-"}</td>
                <td className="px-4 py-2 bg-purple-50/30">{row.topcoatAdhesiveTestResult || "-"}</td>
                
                <td className="px-4 py-2 border-l border-gray-100">{row.additionalRemark || "-"}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
