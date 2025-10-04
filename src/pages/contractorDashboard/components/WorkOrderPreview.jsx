import React from "react";

export default function WorkOrderPreview({ selectedWorkOrder }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">Work Order Preview</div>
          <div className="text-xs text-gray-400">Select a work order to view details</div>
        </div>
      </div>

      {selectedWorkOrder ? (
        <div className="mt-3">
          <div className="h-36 rounded-md overflow-hidden mb-3">
            <img 
              src={selectedWorkOrder.image + "&auto=format&fit=crop&w=800&q=60"} 
              alt="" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="text-sm font-medium">#{selectedWorkOrder.id}</div>
          <div className="text-xs text-gray-500">{selectedWorkOrder.make} · {selectedWorkOrder.year}</div>

          <div className="mt-3 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-gray-100 rounded cursor-pointer">Cancel</button>
            <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded cursor-pointer">Update</button>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-xs text-gray-400">No selection</div>
      )}
    </div>
  );
}
