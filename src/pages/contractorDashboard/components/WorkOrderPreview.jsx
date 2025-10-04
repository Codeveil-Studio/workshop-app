import React, { useState } from "react";
import { Edit2, Save, X } from "lucide-react";

export default function WorkOrderPreview({ selectedWorkOrder, setWorkOrders, setSelectedWorkOrder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const handleEdit = () => {
    setEditData({
      customerName: selectedWorkOrder.customerName,
      phone: selectedWorkOrder.phone,
      make: selectedWorkOrder.make,
      model: selectedWorkOrder.model,
      year: selectedWorkOrder.year,
      vin: selectedWorkOrder.vin,
      status: selectedWorkOrder.status
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setWorkOrders(prev => 
      prev.map(order => 
        order.id === selectedWorkOrder.id 
          ? { ...order, ...editData }
          : order
      )
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleCancelAndDeselect = () => {
    setEditData({});
    setIsEditing(false);
    setSelectedWorkOrder(null);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">Work Order Preview</div>
          <div className="text-xs text-gray-400">
            {selectedWorkOrder ? "Click Update to edit details" : "Select a work order to view details"}
          </div>
        </div>
        {selectedWorkOrder && !isEditing && (
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
            title="Edit Work Order"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {selectedWorkOrder ? (
        <div className="mt-3">
          <div className="h-32 sm:h-36 rounded-md overflow-hidden mb-3">
            <img 
              src={selectedWorkOrder.image + "&auto=format&fit=crop&w=800&q=60"} 
              alt="" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div className="text-sm font-medium">#{selectedWorkOrder.id}</div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Customer Name</label>
                  <input
                    type="text"
                    value={editData.customerName || ""}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <input
                    type="text"
                    value={editData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Make</label>
                    <input
                      type="text"
                      value={editData.make || ""}
                      onChange={(e) => handleInputChange("make", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Model</label>
                    <input
                      type="text"
                      value={editData.model || ""}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Year</label>
                    <input
                      type="number"
                      value={editData.year || ""}
                      onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <select
                      value={editData.status || ""}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500">VIN</label>
                  <input
                    type="text"
                    value={editData.vin || ""}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  <Save size={14} />
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium mb-2">#{selectedWorkOrder.id}</div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span> {selectedWorkOrder.customerName}
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span> {selectedWorkOrder.phone}
                </div>
                <div>
                  <span className="text-gray-500">Vehicle:</span> {selectedWorkOrder.make} {selectedWorkOrder.model} ({selectedWorkOrder.year})
                </div>
                <div>
                  <span className="text-gray-500">VIN:</span> {selectedWorkOrder.vin}
                </div>
                <div>
                  <span className="text-gray-500">Date:</span> {selectedWorkOrder.date}
                </div>
                <div>
                  <span className="text-gray-500">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedWorkOrder.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                    selectedWorkOrder.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    selectedWorkOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedWorkOrder.status}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Items:</div>
                <div className="space-y-1">
                  {selectedWorkOrder.items.map((item, index) => (
                    <div key={index} className="text-xs text-gray-600 flex justify-between">
                      <span>{item.desc} (x{item.qty})</span>
                      <span>${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2">
                  <div className="text-sm font-medium flex justify-between">
                    <span>Total:</span>
                    <span>${selectedWorkOrder.items.reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                 <button 
                   onClick={handleEdit}
                   className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                 >
                   Update
                 </button>
                 <button 
                   onClick={handleCancelAndDeselect}
                   className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors"
                 >
                   Cancel
                 </button>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 text-xs text-gray-400">No selection</div>
      )}
    </div>
  );
}
