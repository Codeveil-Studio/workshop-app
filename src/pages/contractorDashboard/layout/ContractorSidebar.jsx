import React from "react";
import { Home, PlusCircle, Bell, FileText, LogOut } from "lucide-react";

export default function ContractorSidebar({ activeTab, setActiveTab, user }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg border-t z-50">
      <div className="flex items-center justify-around py-2 px-4">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center p-3 rounded-lg ${
            activeTab === "home" ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-100"
          }`}
          title="Home"
        >
          <Home size={24} />
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`flex flex-col items-center justify-center p-3 rounded-lg ${
            activeTab === "create" ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-100"
          }`}
          title="Create Work Order"
        >
          <PlusCircle size={24} />
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex flex-col items-center justify-center p-3 rounded-lg ${
            activeTab === "notifications" ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-100"
          }`}
          title="Notifications"
        >
          <Bell size={24} />
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center justify-center p-3 rounded-lg ${
            activeTab === "orders" ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-100"
          }`}
          title="Work Orders"
        >
          <FileText size={24} />
        </button>

        <button className="flex flex-col items-center justify-center p-3 rounded-lg text-red-500 hover:bg-red-50" title="Logout">
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
}
