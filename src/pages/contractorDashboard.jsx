import { useState } from "react";
import { PlusCircle, Home, Bell, FileText, User, LogOut } from "lucide-react";

export default function ContractorDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
        {/* Left: Logo / App name */}
        <div className="text-xl font-bold text-green-600">Workshop App</div>

        {/* Center: Nav icons */}
        <nav className="hidden md:flex gap-6">
          <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 ${activeTab === "home" ? "text-green-600" : "text-gray-600"}`}>
            <Home size={20} /> Home
          </button>
          <button onClick={() => setActiveTab("create")} className={`flex items-center gap-2 ${activeTab === "create" ? "text-green-600" : "text-gray-600"}`}>
            <PlusCircle size={20} /> Create Work Order
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <Bell size={20} /> Notifications
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <FileText size={20} /> Work Orders
          </button>
        </nav>

        {/* Right: User info */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{user?.name || "John Doe"}</p>
            <p className="text-xs text-gray-500">{user?.email || "john@example.com"}</p>
          </div>
          <User className="w-8 h-8 text-gray-600" />
          <button className="text-red-500 flex items-center gap-1 hover:text-red-600">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {activeTab === "home" && (
          <div>
            {/* Search + Hero */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search work order"
                className="w-full md:w-1/2 px-4 py-2 border rounded-lg"
              />
              <div className="bg-green-100 p-6 mt-4 rounded-lg flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Create & Search Work Easily</h2>
                  <p className="text-sm text-gray-600">Manage your work orders in one place.</p>
                </div>
                <img src="https://via.placeholder.com/100" alt="banner" />
              </div>
            </div>

            {/* Work Orders List */}
            <h3 className="text-lg font-semibold mb-3">List of Work Orders</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[7836, 4566, 5966, 8971].map((id) => (
                <div key={id} className="bg-white rounded-lg shadow p-4">
                  <img src="https://via.placeholder.com/150" alt="work" className="rounded mb-2" />
                  <p className="text-sm font-medium">#{id}</p>
                  <p className="text-xs text-gray-500">Year: 2018</p>
                  <p className="text-xs text-gray-500">Make: BMW</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Work Order</h2>

            {/* Customer Info */}
            <h3 className="text-green-600 font-semibold mb-2">Customer Information</h3>
            <input className="w-full border p-2 mb-3 rounded" placeholder="Customer Name" />
            <input className="w-full border p-2 mb-3 rounded" placeholder="Phone Number" />

            {/* Vehicle Info */}
            <h3 className="text-green-600 font-semibold mb-2">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Make" />
              <input className="border p-2 rounded" placeholder="Model" />
              <input className="border p-2 rounded" placeholder="VIN" />
              <input className="border p-2 rounded" placeholder="Year" />
              <input className="border p-2 rounded" placeholder="Odometer" />
              <input className="border p-2 rounded" placeholder="Confirm Odometer" />
              <input className="col-span-2 border p-2 rounded" placeholder="Trim" />
            </div>

            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">Upload Vehicle Photos</button>
          </div>
        )}
      </main>
    </div>
  );
}
