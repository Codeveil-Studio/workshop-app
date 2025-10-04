import React, { useState } from "react";
import { Search, Plus, Bell } from "lucide-react";

export default function ContractorHeader({ 
  user, 
  onCreateClick, 
  query, 
  setQuery, 
  notifications = [], 
  markAllRead, 
  clearNotifications 
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-30 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-green-600 text-white font-bold">CD</div>
        <div>
          <div className="text-lg font-semibold">Contractor Dashboard</div>
          <div className="text-xs text-gray-500">Welcome back — manage your work orders</div>
        </div>
      </div>

      <div className="flex-1 px-6">
        <div className="max-w-2xl mx-auto">
          <label className="relative block">
            <span className="sr-only">Search work orders</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={16} />
            </span>
            <input
              className="placeholder:italic placeholder:text-slate-400 block bg-gray-100 w-full border border-transparent rounded-md py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search work orders, customer, VIN..."
              value={query || ""}
              onChange={(e) => setQuery && setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md shadow-sm text-sm"
        >
          <Plus size={16} />
          Create
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-40">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="font-medium">Notifications</div>
                <div className="text-sm flex items-center gap-2">
                  <button onClick={markAllRead} className="text-xs text-slate-500 hover:underline">Mark all</button>
                  <button onClick={clearNotifications} className="text-xs text-red-500 hover:underline">Clear</button>
                </div>
              </div>
              <div className="max-h-64 overflow-auto">
                {notifications.length === 0 && <div className="p-4 text-sm text-gray-500">No notifications</div>}
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 border-b ${n.read ? "bg-white" : "bg-gray-50"}`}>
                    <div className="text-sm">{n.text}</div>
                    <div className="text-xs text-gray-400">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-right hidden md:block">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </div>
      </div>
    </header>
  );
}
