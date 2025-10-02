import React from "react";
import { Plus, Minus } from "lucide-react";

export default function SpareParts({ spareCatalog, partsCart, addPartToCart, changeCartQty }) {
  return (
    <div className="md:flex md:gap-6">
      <div className="md:flex-1">
        <h3 className="text-sm font-semibold text-green-600 mb-3">Add Spare Parts</h3>
        <div className="grid grid-cols-2 gap-3">
          {spareCatalog.map((p) => (
            <div key={p.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-gray-400">${p.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => addPartToCart(p)} className="px-3 py-1 bg-green-50 text-green-600 rounded">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:w-80 mt-4 md:mt-0">
        <h4 className="text-sm font-semibold mb-2">Parts in Order</h4>
        <div className="space-y-2">
          {partsCart.length === 0 && <div className="text-xs text-gray-400">No parts added yet</div>}
          {partsCart.map((c) => (
            <div key={c.id} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-xs text-gray-400">${c.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => changeCartQty(c.id, -1)} className="p-1 bg-gray-100 rounded">
                  <Minus size={14} />
                </button>
                <div className="w-6 text-center">{c.qty}</div>
                <button onClick={() => changeCartQty(c.id, 1)} className="p-1 bg-gray-100 rounded">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
