import React from "react";
import { Plus, Minus } from "lucide-react";

export default function WorkTypes({ workTypes, toggleWorkTypeSelection, otherText = '', onOtherTextChange }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-green-600 mb-3">Add Work Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workTypes.map((w) => (
          <div 
            key={w.id} 
            className={`rounded-lg p-3 flex flex-col gap-3 transition-colors ${
              w.selected 
                ? 'bg-green-50 border-2 border-green-400' 
                : 'bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className="h-24 sm:h-28 rounded-md overflow-hidden">
              <img src={w.img + "&auto=format&fit=crop&w=800&q=60"} alt={w.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex-1 min-w-0 truncate pr-2">{w.title}</div>
              <button 
                onClick={() => toggleWorkTypeSelection(w.id)} 
                className={`p-2 rounded-md border transition-colors cursor-pointer flex-shrink-0 ${
                  w.selected 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                }`}
              >
                {w.selected ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            </div>
            {w.id === 'others' && w.selected && (
              <div className="mt-2">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => onOtherTextChange && onOtherTextChange(e.target.value)}
                  placeholder="Please specify the work type"
                  className={`w-full p-2 rounded border ${
                    (otherText || '').trim() ? 'border-green-400' : 'border-red-400'
                  } focus:outline-none focus:ring-2 focus:ring-green-300`}
                />
                <p className="text-xs mt-1 ${ (otherText || '').trim() ? 'text-gray-500' : 'text-red-600' }">{(otherText || '').trim() ? 'Provide more details if needed.' : 'This field is required when selecting Other.'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
