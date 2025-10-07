// SupplierDashboard.jsx
// Drop this file into your Vite + React + Tailwind project.
// Requires: Tailwind CSS + React. (No other deps required)
// Usage: import SupplierDashboard from './SupplierDashboard'; <SupplierDashboard />

import React, { useEffect, useMemo, useState, useRef } from "react";

/**
 * Supplier Dashboard
 *
 * Features implemented (based on uploaded PDF + Design.json):
 * - Sidebar & header
 * - Search orders
 * - Status tabs (All, Sent, In Progress, Finished, Approved By Contractor)
 * - Work order list with expandable details
 * - Change status inline (updates UI)
 * - Generate Invoice modal (preview)
 * - Services / Price List on right panel
 * - Modify Price modal (update service prices)
 * - Notifications panel with clear all
 *
 * Styling: Tailwind classes + some CSS variables injected locally to match Design.json colors.
 */

export default function SupplierDashboard() {
  // Inject Inter font from Google (one-time)
  useEffect(() => {
    if (!document.querySelector("#supplier-dashboard-inter")) {
      const link = document.createElement("link");
      link.id = "supplier-dashboard-inter";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // ---------- Sample data (based on PDF snippets) ----------
  const [orders, setOrders] = useState([
    {
      id: "W01",
      title: "Car Engine Repair",
      contractor: "AutoFix Ltd",
      startDate: "2023-03-01",
      completionDate: null,
      status: "In Progress",
      totalCost: 199,
      details: "Replace piston rings, tune engine, test drive.",
      services: [
        { id: "S03", name: "Engine Repair", price: 199 },
      ],
    },
    {
      id: "W02",
      title: "Car Washing",
      contractor: "Sparkle Wash",
      startDate: "2023-07-03",
      completionDate: "2023-07-03",
      status: "Finished",
      totalCost: 29,
      details: "Exterior wash, vacuum, window polish.",
      services: [{ id: "S01", name: "Car Washing", price: 29 }],
    },
    {
      id: "W03",
      title: "Steering Repair",
      contractor: "SteerRight",
      startDate: "2023-07-03",
      completionDate: "2023-07-03",
      status: "Contractor",
      totalCost: 45,
      details: "Tie rod replacement, alignment check.",
      services: [{ id: "S02", name: "Steering Repair", price: 45 }],
    },
    {
      id: "W04",
      title: "Tire Replacement",
      contractor: "WheelHouse",
      startDate: "2023-09-01",
      completionDate: null,
      status: "Sent",
      totalCost: 179,
      details: "Replace two tires, balance & alignment.",
      services: [{ id: "S06", name: "Tire", price: 179 }],
    },
  ]);

  const [services, setServices] = useState([
    { id: "S01", name: "Car Washing", price: 29 },
    { id: "S02", name: "Steering Repair", price: 45 },
    { id: "S03", name: "Engine Repair", price: 199 },
    { id: "S04", name: "Clutch", price: 89 },
    { id: "S05", name: "Break", price: 49 }, // as in PDF text ("Break")
    { id: "S06", name: "Tire", price: 179 },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Your work is approved by contractor",
      time: "11:10 pm",
      read: false,
    },
    {
      id: 2,
      title: "New work order received: #W04",
      time: "09:20 am",
      read: false,
    },
    {
      id: 3,
      title: "Price change requested for Steering Repair",
      time: "Yesterday",
      read: true,
    },
  ]);

  // UI state
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Modify price modal
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");

  // Invoice modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Notifications panel
  const [notifOpen, setNotifOpen] = useState(false);
  const notificationRef = useRef(null);

  // Status changer state for each order (which one is showing arrows)
  const [activeStatusChanger, setActiveStatusChanger] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState({});

  // User state
  const [user, setUser] = useState({ name: "Supplier Name", email: "supplier@example.com" });
  const [userLoading, setUserLoading] = useState(false);

  const STATUS_COLORS = {
    "Sent": "bg-gray-200 text-gray-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Finished": "bg-green-100 text-green-800",
    "Contractor": "bg-green-200 text-green-900",
  };

  const STATUS_HOVER_COLORS = {
    "Sent": "hover:bg-gray-300",
    "In Progress": "hover:bg-yellow-200",
    "Finished": "hover:bg-green-200",
    "Contractor": "hover:bg-green-300",
  };

  const STATUS_LIST = ["Sent", "In Progress", "Finished", "Contractor"];

  // ---------- Derived / Filtered Data ----------
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const tabOk = selectedTab === "All" ? true : o.status === selectedTab;
      const searchOk =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.contractor.toLowerCase().includes(q);
      return tabOk && searchOk;
    });
  }, [orders, search, selectedTab]);

  const stats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter((o) => o.status === "In Progress").length;
    const finished = orders.filter((o) => o.status === "Finished").length;
    const approved = orders.filter((o) => o.status === "Approved").length;
    return { total, inProgress, finished, approved };
  }, [orders]);

  // ---------- Actions ----------
  function changeOrderStatus(orderId, newStatus) {
    setOrders((prev) => {
      return prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            completionDate: newStatus === "Finished" ? new Date().toISOString().slice(0, 10) : o.completionDate,
          };
        }
        return o;
      });
    });
  }

  function openModifyPrice(service) {
    setEditingService(service);
    setEditingPrice(String(service.price));
    setPriceModalOpen(true);
  }

  function savePriceChange() {
    const parsed = parseFloat(editingPrice);
    if (isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid price.");
      return;
    }
    setServices((prev) => prev.map((s) => (s.id === editingService.id ? { ...s, price: parsed } : s)));
    // Update any orders that reference this service id (reflect price change in totalCost)
    setOrders((prev) =>
      prev.map((o) => {
        const has = o.services.some((sv) => sv.id === editingService.id);
        if (!has) return o;
        // recompute total from service ids mapping to services array
        const newTotal = o.services.reduce((sum, sv) => {
          const found = (sv.id && services.find((s) => s.id === sv.id)) || sv; // fallback
          const newPrice = sv.id === editingService.id ? parsed : found.price;
          return sum + newPrice;
        }, 0);
        return { ...o, totalCost: newTotal };
      })
    );
    setPriceModalOpen(false);
    setEditingService(null);
    setEditingPrice("");
  }

  function openInvoice(order) {
    setInvoiceOrder(order);
    setInvoiceModalOpen(true);
  }

  function markNotificationRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleLogout() {
    console.log("Logging out...");
    // Add logout logic here
  }

  function addService(name, price) {
    const id = `S${String(Math.floor(Math.random() * 10000)).padStart(2, "0")}`;
    const parsed = parseFloat(price) || 0;
    setServices((prev) => [...prev, { id, name, price: parsed }]);
  }

  // Toggle status changer arrows for specific order
  function toggleStatusChanger(orderId) {
    setActiveStatusChanger(prev => prev === orderId ? null : orderId);
  }

  // Close status changer
  function closeStatusChanger() {
    setActiveStatusChanger(null);
  }

  // Cycle status up (next in the list)
  function cycleStatusUp(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentIndex = STATUS_LIST.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % STATUS_LIST.length;
    const newStatus = STATUS_LIST[nextIndex];
    
    // Start transition animation
    setIsTransitioning(prev => ({ ...prev, [orderId]: 'up' }));
    
    setTimeout(() => {
      changeOrderStatus(orderId, newStatus);
      setIsTransitioning(prev => ({ ...prev, [orderId]: false }));
    }, 150);
  }

  // Cycle status down (previous in the list)
  function cycleStatusDown(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentIndex = STATUS_LIST.indexOf(order.status);
    const prevIndex = currentIndex === 0 ? STATUS_LIST.length - 1 : currentIndex - 1;
    const newStatus = STATUS_LIST[prevIndex];
    
    // Start transition animation
    setIsTransitioning(prev => ({ ...prev, [orderId]: 'down' }));
    
    setTimeout(() => {
      changeOrderStatus(orderId, newStatus);
      setIsTransitioning(prev => ({ ...prev, [orderId]: false }));
    }, 150);
  }

  // Handle click outside notification popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }

    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);

  // Handle click outside status changer
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click is outside any status changer
      if (!event.target.closest('.status-changer')) {
        closeStatusChanger();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ---------- Helpers ----------
  function formatCurrency(v) {
    // compute digit by digit: create string using toFixed (safe)
    const num = Number(v) || 0;
    return `$${num.toFixed(2)}`;
  }

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', Roboto, sans-serif" }}>
      <style>{`
        :root{
          --primary: #29cc6a;
          --secondary: #34C759;
          --accent: #FF9500;
          --bg-light: #FFFFFF;
          --bg-dark: #F4F5F7;
          --text-primary: #111111;
          --text-secondary: #6B6B6B;
        }
        .sd-badge { font-weight:600; font-size:0.8rem; padding:0.25rem 0.5rem; border-radius:9999px;}
        .sd-card { box-shadow: 0 1px 3px rgba(0,0,0,0.06); border-radius:12px; background:var(--bg-light); }
        .sd-modal { background: rgba(12,12,12,0.5); position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:60; }
      `}</style>

      {/* Top header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[var(--primary)] text-white font-bold">SD</div>
          <div>
            <div className="text-lg font-semibold">Supplier Dashboard</div>
            <div className="text-xs text-gray-500">Manage orders, services and invoices</div>
          </div>
        </div>

        <div className="flex-1 px-6">
          <div className="max-w-2xl mx-auto">
            <label className="relative block">
              <span className="sr-only">Search orders</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                className="placeholder:italic placeholder:text-slate-400 block bg-gray-100 w-full border border-transparent rounded-md py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Search work, contractor, id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 17H9a3 3 0 006 0zM18 8a6 6 0 10-12 0v5l-2 2h16l-2-2V8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {notifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
              )}
            </button>

            {/* Notifications popover */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-md p-3 z-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllRead}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Mark all read
                    </button>
                    <button onClick={() => clearNotifications()} className="text-xs text-red-500">Clear</button>
                  </div>
                </div>
                <div className="max-h-64 overflow-auto">
                  {notifications.length === 0 && <div className="text-xs text-gray-400">No notifications</div>}
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2 rounded-md flex items-start gap-3 ${n.read ? "bg-gray-50" : "bg-green-50"}`}>
                      <div className="flex-1 text-sm">
                        <div className="font-medium text-gray-800">{n.title}</div>
                        <div className="text-xs text-gray-500">{n.time}</div>
                      </div>
                      {!n.read && (
                        <button onClick={() => markNotificationRead(n.id)} className="text-xs text-[#29cc6a]">Mark</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              {userLoading ? (
                <div className="text-sm font-medium text-gray-400">Loading...</div>
              ) : (
                <>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#29cc6a] font-semibold cursor-pointer" onClick={handleLogout} title="Logout">
              {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Left Sidebar - Price List and Recent Activity */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Price List */}
            <div className="sd-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold">Price List</h3>
                  <div className="text-xs text-gray-500">Services you offer</div>
                </div>
                <button
                  onClick={() => {
                    const name = prompt("Service name (e.g. 'Oil Change'):");
                    if (!name) return;
                    const price = prompt("Price (numeric):", "0");
                    addService(name, parseFloat(price || 0));
                  }}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                >
                  Add Service
                </button>
              </div>

              <div className="space-y-2">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500">#{s.id}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">{formatCurrency(s.price)}</div>
                        <button onClick={() => openModifyPrice(s)} className="text-xs text-green-600 hover:underline">Modify Price</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            {/* Recent Activity */}
            <div className="sd-card p-4">
              <h4 className="text-sm font-semibold">Recent Activity</h4>
              <div className="text-xs text-gray-500 mt-1">Recent events</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1" />
                  <div>
                    <div className="font-medium">#W03 approved</div>
                    <div className="text-xs text-gray-500">Approved • 2 days ago</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1" />
                  <div>
                    <div className="font-medium">Price updated - Engine Repair</div>
                    <div className="text-xs text-gray-500">You changed the price • 1 week ago</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="sd-card p-4">
                <div className="text-sm text-gray-500">Total Orders</div>
                <div className="text-2xl font-semibold">{stats.total}</div>
              </div>
              <div className="sd-card p-4">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-semibold">{stats.inProgress}</div>
              </div>
              <div className="sd-card p-4">
                <div className="text-sm text-gray-500">Finished</div>
                <div className="text-2xl font-semibold">{stats.finished}</div>
              </div>
              <div className="sd-card p-4">
                <div className="text-sm text-gray-500">Approved</div>
                <div className="text-2xl font-semibold">{stats.approved}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-md">
              {["All", ...STATUS_LIST].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTab(t)}
                  className={`px-3 py-1 rounded-md text-sm ${selectedTab === t ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">No work orders match your filters.</div>
              )}
              {filteredOrders.map((o) => {
                  return (
                      <div key={o.id} className="sd-card p-4 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">{o.id}</div>
                          <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                  <div>
                                      <div className="text-md font-semibold text-gray-900">{o.title}</div>
                                      <div className="text-xs text-gray-500">Contractor: {o.contractor} • Start: {o.startDate}{o.completionDate ? ` • Completed: ${o.completionDate}` : ""}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <div className="text-sm font-semibold">{formatCurrency(o.totalCost)}</div>
                                      <button
                                          className="text-sm p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                          onClick={() => openInvoice(o)}
                                          title="Download Invoice"
                                      >
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                              <polyline points="7,10 12,15 17,10" />
                                              <line x1="12" y1="15" x2="12" y2="3" />
                                          </svg>
                                      </button>
                                      <div className="flex items-center gap-1 status-changer">
                                          <button
                                              type="button"
                                              onClick={() => toggleStatusChanger(o.id)}
                                              className={`sd-badge ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-700"} border-0 cursor-pointer hover:opacity-80 transition-all duration-300 w-28 text-center relative overflow-hidden ${isTransitioning[o.id] ? 'pointer-events-none' : ''}`}
                                          >
                                              <span 
                                                  className={`block transition-transform duration-300 ease-out ${
                                                      isTransitioning[o.id] === 'up' ? '-translate-y-full opacity-0' :
                                                      isTransitioning[o.id] === 'down' ? 'translate-y-full opacity-0' :
                                                      'translate-y-0 opacity-100'
                                                  }`}
                                              >
                                                  {o.status}
                                              </span>
                                          </button>
                                          {activeStatusChanger === o.id && (
                                               <div className="flex flex-col gap-0.5 ml-1">
                                                   {/* Up Arrow */}
                                                   <button
                                                       onClick={(e) => {
                                                           e.stopPropagation();
                                                           cycleStatusUp(o.id);
                                                       }}
                                                       className="rounded-sm px-1 py-0.5 hover:opacity-80 transition-all duration-150 shadow-sm text-white flex items-center justify-center"
                                                       style={{ 
                                                           width: '14px', 
                                                           height: '14px',
                                                           backgroundColor: '#29cc6a'
                                                       }}
                                                   >
                                                       <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                                                           <polyline points="18,15 12,9 6,15"></polyline>
                                                       </svg>
                                                   </button>
                                                   {/* Down Arrow */}
                                                   <button
                                                       onClick={(e) => {
                                                           e.stopPropagation();
                                                           cycleStatusDown(o.id);
                                                       }}
                                                       className="rounded-sm px-1 py-0.5 hover:opacity-80 transition-all duration-150 shadow-sm text-white flex items-center justify-center"
                                                       style={{ 
                                                           width: '14px', 
                                                           height: '14px',
                                                           backgroundColor: '#29cc6a',
                                                       }}
                                                   >
                                                       <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                                                           <polyline points="6,9 12,15 18,9"></polyline>
                                                       </svg>
                                                   </button>
                                               </div>
                                           )}
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-3 text-sm text-gray-700">
                                  {o.details}
                              </div>

                              <div className="mt-3 flex items-center gap-3">
                                  <button
                                      onClick={() => setExpandedOrderId((prev) => (prev === o.id ? null : o.id))}
                                      className="text-xs text-blue-600"
                                  >
                                      {expandedOrderId === o.id ? "Hide details" : "View details"}
                                  </button>
                                  <button
                                      onClick={() => {
                                          // Quick approve workflow simulation
                                          changeOrderStatus(o.id, "Approved");
                                      } }
                                      className="text-xs text-gray-600"
                                  >
                                      Approve
                                  </button>
                              </div>

                              {/* Expanded details */}
                              {expandedOrderId === o.id && (
                                  <div className="mt-3 border-t pt-3 text-sm text-gray-700">
                                      <div className="font-medium mb-2">Services</div>
                                      <ul className="space-y-2">
                                          {o.services.map((s) => {
                                              // find latest price
                                              const match = services.find((srv) => srv.id === s.id) || s;
                                              return (
                                                  <li key={s.id} className="flex items-center justify-between">
                                                      <div>{match.name}</div>
                                                      <div className="text-sm font-semibold">{formatCurrency(match.price)}</div>
                                                  </li>
                                              );
                                          })}
                                      </ul>
                                  </div>
                              )}
                          </div>
                      </div>
                  );
              })}
              </div>
            </div>
          </div>
      </main>

      {/* Modify Price Modal */}
      {priceModalOpen && editingService && (
        <div className="sd-modal" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-lg w-[480px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Modify Price</h3>
              <button onClick={() => setPriceModalOpen(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <div className="text-xs text-gray-500">Service</div>
                <div className="font-medium">{editingService.name} <span className="text-xs text-gray-400">#{editingService.id}</span></div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Current price</div>
                <div className="text-sm font-semibold">{formatCurrency(editingService.price)}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500">New price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPrice}
                  onChange={(e) => setEditingPrice(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button onClick={() => setPriceModalOpen(false)} className="px-3 py-1 rounded-md bg-gray-100 text-sm">Cancel</button>
                <button onClick={savePriceChange} className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModalOpen && invoiceOrder && (
        <div className="sd-modal" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-lg w-[640px] p-5 overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Invoice</h3>
                <div className="text-xs text-gray-500">Work order: {invoiceOrder.id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{formatCurrency(invoiceOrder.totalCost)}</div>
                <div className="text-xs text-gray-500">Total due</div>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-400 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Contractor</div>
                  <div className="font-medium">{invoiceOrder.contractor}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Service Date</div>
                  <div className="font-medium">{invoiceOrder.startDate}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-medium mb-2">Services</div>
                <div className="border border-gray-400 rounded-md">
                  {invoiceOrder.services.map((s) => {
                    const srv = services.find((ss) => ss.id === s.id) || s;
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div className="text-sm">{srv.name}</div>
                        <div className="text-sm font-semibold">{formatCurrency(srv.price)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-4">
                <button onClick={() => setInvoiceModalOpen(false)} className="px-3 py-1 rounded-md bg-gray-100 text-sm">Close</button>
                <button
                  onClick={() => {
                    // Quick preview "download" - open print dialog for invoice area
                    window.print();
                  }}
                  className="px-3 py-1 rounded-md bg-[#29cc6a] text-white text-sm"
                >
                  Print / Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
