import React from "react";
import { Plus, Minus } from "lucide-react";

export default function WorkTypes({ workTypes, changeWorkTypeQty }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-green-600 mb-3">Add Work Type</h3>
      <div className="grid grid-cols-3 gap-4">
        {workTypes.map((w) => (
          <div key={w.id} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-3">
            <div className="h-28 rounded-md overflow-hidden">
              <img src={w.img + "&auto=format&fit=crop&w=800&q=60"} alt={w.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{w.title}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => changeWorkTypeQty(w.id, -1)} className="p-1 bg-white rounded-md border">
                  <Minus size={14} />
                </button>
                <div className="w-6 text-center">{w.qty}</div>
                <button onClick={() => changeWorkTypeQty(w.id, 1)} className="p-1 bg-white rounded-md border">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
