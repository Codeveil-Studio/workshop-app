import React from "react";

export default function WorkOrdersList({ workOrders, selectedWorkOrder, setSelectedWorkOrder }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">List Of Work Orders</h3>
        <button className="text-sm text-green-600 hover:underline">See all</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {workOrders.map((wo) => (
          <div
            key={wo.id}
            onClick={() => { setSelectedWorkOrder(wo); }}
            className={`bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition ${selectedWorkOrder?.id === wo.id ? "ring-2 ring-green-100" : ""}`}
          >
            <div className="w-full h-36 overflow-hidden rounded-md mb-3">
              <img src={wo.image + "&auto=format&fit=crop&w=800&q=60"} alt={`#${wo.id}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">#{wo.id}</div>
                <div className="text-xs text-gray-500">{wo.make} · {wo.year}</div>
              </div>
              <div className="text-xs text-gray-400">Open</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
