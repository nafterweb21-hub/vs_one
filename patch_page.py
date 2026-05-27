import re

with open("src/app/dashboard/sales/sales-order/[id]/page.tsx", "r") as f:
    content = f.read()

# 1. Update data loading
content = content.replace(
"""          setItems(
            orderData.items.map((item: any) => ({
              ...item,
              deliveryDate: new Date(item.deliveryDate).toISOString().split("T")[0],
            }))
          );""",
"""          setItems(
            orderData.items.map((item: any) => ({
              ...item,
              batches: (item.batches || []).map((b: any) => ({
                ...b,
                deliveryDate: new Date(b.deliveryDate).toISOString().split("T")[0],
              }))
            }))
          );"""
)

# 2. Update Handlers
handlers_old = """  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        partId: "",
        quantity: 1,
        uomId: "",
        unitPrice: 0,
        deliveryDate: new Date().toISOString().split("T")[0],
        noRoutingProcess: false,
        remark: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };"""

handlers_new = """  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleBatchChange = (itemIndex: number, batchIndex: number, field: string, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      const newBatches = [...newItems[itemIndex].batches];
      newBatches[batchIndex] = { ...newBatches[batchIndex], [field]: value };
      newItems[itemIndex] = { 
        ...newItems[itemIndex], 
        batches: newBatches,
      };
      if (field === "quantity") {
        newItems[itemIndex].quantity = newBatches.reduce((sum: number, b: any) => sum + (Number(b.quantity) || 0), 0);
      }
      return newItems;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        partId: "",
        internalQuotationNo: "",
        vendorMaterialNo: "",
        materialSpecification: "",
        estimateNo: "",
        remark: "",
        uploadUrl: "",
        quantity: 1,
        uomId: "",
        unitPrice: 0,
        batches: [
          {
            quantity: 1,
            deliveryDate: new Date().toISOString().split("T")[0],
            noRoutingProcess: false,
            remark: "",
            uploadUrl: "",
          }
        ]
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addBatch = (itemIndex: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[itemIndex].batches.push({
        quantity: 1,
        deliveryDate: new Date().toISOString().split("T")[0],
        noRoutingProcess: false,
        remark: "",
        uploadUrl: "",
      });
      newItems[itemIndex].quantity = newItems[itemIndex].batches.reduce((sum: number, b: any) => sum + (Number(b.quantity) || 0), 0);
      return newItems;
    });
  };

  const removeBatch = (itemIndex: number, batchIndex: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[itemIndex].batches = newItems[itemIndex].batches.filter((_: any, i: number) => i !== batchIndex);
      newItems[itemIndex].quantity = newItems[itemIndex].batches.reduce((sum: number, b: any) => sum + (Number(b.quantity) || 0), 0);
      return newItems;
    });
  };"""

content = content.replace(handlers_old, handlers_new)

# 3. Update the UI
ui_old = """                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-blue-500 mb-1">Part <span className="text-red-500">*</span></label>
                        <select
                          value={item.partId}
                          onChange={(e) => handleItemChange(index, "partId", e.target.value)}
                          className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">Select Part</option>
                          {formDataCache?.finishedGoods?.map((fg: any) => (
                            <option key={fg.id} value={fg.id}>{fg.partNo} - {fg.description}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-blue-500 mb-1">Quantity <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-blue-500 mb-1">UOM <span className="text-red-500">*</span></label>
                        <select
                          value={item.uomId}
                          onChange={(e) => handleItemChange(index, "uomId", e.target.value)}
                          className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">Select UOM</option>
                          {formDataCache?.uoms?.map((u: any) => (
                            <option key={u.id} value={u.id}>{u.uomName}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-blue-500 mb-1">Unit Price <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice || ""}
                          onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-blue-500 mb-1">Delivery Date <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={item.deliveryDate}
                          onChange={(e) => handleItemChange(index, "deliveryDate", e.target.value)}
                          className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center pt-5">
                        <label className="flex items-center gap-2 text-sm text-blue-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.noRoutingProcess}
                            onChange={(e) => handleItemChange(index, "noRoutingProcess", e.target.checked)}
                            className="rounded border-blue-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          No Routing Process
                        </label>
                      </div>
                    </div>"""

ui_new = """                    <div className="flex-1 space-y-4">
                      {/* Item Level Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pb-4 border-b border-blue-200">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-blue-500 mb-1">Part <span className="text-red-500">*</span></label>
                          <select
                            value={item.partId}
                            onChange={(e) => handleItemChange(index, "partId", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">Select Part</option>
                            {formDataCache?.finishedGoods?.map((fg: any) => (
                              <option key={fg.id} value={fg.id}>{fg.partNo} - {fg.description}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">Int. Quotation <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={item.internalQuotationNo || ""}
                            onChange={(e) => handleItemChange(index, "internalQuotationNo", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">Unit Price <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice || ""}
                            onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">UOM <span className="text-red-500">*</span></label>
                          <select
                            value={item.uomId}
                            onChange={(e) => handleItemChange(index, "uomId", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">Select UOM</option>
                            {formDataCache?.uoms?.map((u: any) => (
                              <option key={u.id} value={u.id}>{u.uomName}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">Vendor Material No</label>
                          <input
                            type="text"
                            value={item.vendorMaterialNo || ""}
                            onChange={(e) => handleItemChange(index, "vendorMaterialNo", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-500 mb-1">Estimate No</label>
                          <input
                            type="text"
                            value={item.estimateNo || ""}
                            onChange={(e) => handleItemChange(index, "estimateNo", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-medium text-blue-500 mb-1">Material Specification</label>
                          <input
                            type="text"
                            value={item.materialSpecification || ""}
                            onChange={(e) => handleItemChange(index, "materialSpecification", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-blue-500 mb-1">Item Remark</label>
                          <input
                            type="text"
                            value={item.remark || ""}
                            onChange={(e) => handleItemChange(index, "remark", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-blue-500 mb-1">Item Upload URL</label>
                          <input
                            type="text"
                            value={item.uploadUrl || ""}
                            onChange={(e) => handleItemChange(index, "uploadUrl", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col justify-end pb-1">
                          <span className="text-xs font-medium text-blue-500 mb-1">Total Quantity</span>
                          <span className="text-sm font-bold text-indigo-700">{item.quantity}</span>
                        </div>
                      </div>

                      {/* Batches Level Info */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-blue-900 uppercase">Batches</span>
                          <button
                            type="button"
                            onClick={() => addBatch(index)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"
                          >
                            <Plus size={12} /> Add Batch
                          </button>
                        </div>
                        <div className="space-y-2">
                          {item.batches?.map((batch: any, bIndex: number) => (
                            <div key={bIndex} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-start relative group/batch p-2 bg-white rounded border border-blue-100">
                               <button
                                  type="button"
                                  onClick={() => removeBatch(index, bIndex)}
                                  className="absolute -top-1 -right-1 p-0.5 bg-white text-rose-500 border border-blue-200 rounded-full shadow-sm hover:bg-rose-50 opacity-0 group-hover/batch:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              <div>
                                <label className="block text-[10px] font-medium text-slate-500 mb-1">Qty</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={batch.quantity}
                                  onChange={(e) => handleBatchChange(index, bIndex, "quantity", parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-medium text-slate-500 mb-1">Delivery Date</label>
                                <input
                                  type="date"
                                  value={batch.deliveryDate}
                                  onChange={(e) => handleBatchChange(index, bIndex, "deliveryDate", e.target.value)}
                                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-medium text-slate-500 mb-1">Remark</label>
                                <input
                                  type="text"
                                  value={batch.remark || ""}
                                  onChange={(e) => handleBatchChange(index, bIndex, "remark", e.target.value)}
                                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="flex items-center pt-4">
                                <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={batch.noRoutingProcess}
                                    onChange={(e) => handleBatchChange(index, bIndex, "noRoutingProcess", e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                                  />
                                  No Routing
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>"""

content = content.replace(ui_old, ui_new)

with open("src/app/dashboard/sales/sales-order/[id]/page.tsx", "w") as f:
    f.write(content)
