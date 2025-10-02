import React from "react";
import { Search, Plus } from "lucide-react";

export default function ContractorHeader({ user, onCreateClick }) {
  return (
    <div className="flex items-center justify-between gap-6 mb-6">
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full">
          <Search className="text-gray-400" size={18} />
          <input
            placeholder="Search work order or customer..."
            className="ml-3 w-full outline-none text-sm"
          />
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          <Plus size={16} /> Create
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </div>
      </div>
    </div>
  );
}
