import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

// Layout components
import ContractorSidebar from "./layout/ContractorSidebar";
import ContractorHeader from "./layout/ContractorHeader";

// Home components
import Hero from "./home/Hero";
import WorkOrdersList from "./home/WorkOrdersList";
import OngoingWork from "./home/OngoingWork";

// Create work order components
import CustomerInfo from "./create/CustomerInfo";
import WorkTypes from "./create/WorkTypes";
import SpareParts from "./create/SpareParts";
import ActivityDetails from "./create/ActivityDetails";
import Quote from "./create/Quote";

// Sidebar components
import QuickActions from "./components/QuickActions";
import WorkOrderPreview from "./components/WorkOrderPreview";
import RecentActivity from "./components/RecentActivity";

// Page components
import Notifications from "./notifications/Notifications";
import Orders from "./orders/Orders";

/**
 * ContractorDashboard
 * - Desktop-first contractor dashboard inspired by provided wireframe
 * - Home: Search, Hero, List of Work Orders, Ongoing Work (horizontal)
 * - Create: Multi-step wizard with Work Types, Spare Parts, Activity details and Quote
 * - Enhanced with improved header, search functionality, and invoice download
 */
export default function ContractorDashboard() {
  const [user, setUser] = useState({ name: "Loading...", email: "" });
  const [userLoading, setUserLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home"); // home | create | notifications | orders
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.error('No user email found in localStorage');
          setUser({ name: "Guest User", email: "" });
          setUserLoading(false);
          return;
        }

        const response = await fetch(`/api/auth/user/${encodeURIComponent(userEmail)}`);
        const data = await response.json();

        if (data.success && data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email
          });
        } else {
          console.error('Failed to fetch user data:', data.error);
          setUser({ name: "Guest User", email: userEmail });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({ name: "Guest User", email: "" });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New work order assigned", time: "2 hours ago", read: false },
    { id: 2, text: "Customer feedback received", time: "Yesterday", read: false },
    { id: 3, text: "Invoice payment confirmed", time: "3 days ago", read: true },
    { id: 4, text: "Maintenance reminder: BMW X5", time: "1 day ago", read: false },
    { id: 5, text: "Parts delivery scheduled", time: "4 hours ago", read: false },
  ]);

  // Toast functionality
  const showToast = (msg, ms = 3000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  // Notification handlers
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("All notifications cleared");
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Cleanup toast timer
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Wizard state for Create Work Order
  const [step, setStep] = useState(1);
  const steps = ["Customer", "Work Type", "Spare Parts", "Activity", "Quote"];

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });

  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    vin: "",
    year: "",
    odometer: "",
    confirmOdometer: "",
    trim: "",
  });

  // sample work types (matching the wireframe with small images)
  const initialWorkTypes = [
    { id: "engine", title: "Engine", img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60", selected: false },
    { id: "brakes", title: "Brakes", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=60", selected: false },
    { id: "electrical", title: "Electrical", img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60", selected: false },
    { id: "suspension", title: "Suspension", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=60", selected: false },
    { id: "hvac", title: "HVAC", img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60", selected: false },
    { id: "others", title: "Other", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=60", selected: false },
  ];
  const [workTypes, setWorkTypes] = useState(initialWorkTypes);

  // spare parts catalog (select & add to cart)
  const spareCatalog = [
    { id: "sp1", title: "Oil Filter", price: 12.5 },
    { id: "sp2", title: "Brake Pads", price: 45.0 },
    { id: "sp3", title: "Air Filter", price: 18.0 },
    { id: "sp4", title: "Spark Plug (set)", price: 34.0 },
  ];
  const [partsCart, setPartsCart] = useState([]); // {id,title,price,qty}

  const [activity, setActivity] = useState({
    type: "Inspection",
    description: "",
    repairs: {
      engineCheck: false,
      ecuTesting: false,
      acService: false,
      brake: false,
      oilChange: false,
      other: false,
    },
  });

  // work orders state with initial sample data for the Home grid with extended data for invoice functionality
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 7836, 
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=60", 
      make: "BMW", 
      model: "X5",
      year: 2018,
      customerName: "Michael Smith",
      phone: "555-123-4567",
      vin: "WBA12345678901234",
      date: "2023-07-03",
      status: "Open",
      items: [
        { desc: "Oil Change", qty: 1, price: 89.99 },
        { desc: "Air Filter", qty: 1, price: 45.50 },
      ]
    },
    { 
      id: 4566, 
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=60", 
      make: "Audi", 
      model: "A4",
      year: 2019,
      customerName: "Sarah Johnson",
      phone: "555-987-6543",
      vin: "WAU98765432109876",
      date: "2023-06-28",
      status: "Open",
      items: [
        { desc: "Brake Pads", qty: 2, price: 120.00 },
        { desc: "Labor", qty: 1, price: 150.00 },
      ]
    },
    { 
      id: 5966, 
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=60", 
      make: "Toyota", 
      model: "Camry",
      year: 2016,
      customerName: "David Wilson",
      phone: "555-456-7890",
      vin: "JT765432109876543",
      date: "2023-07-01",
      status: "Open",
      items: [
        { desc: "Timing Belt", qty: 1, price: 180.00 },
        { desc: "Water Pump", qty: 1, price: 95.00 },
        { desc: "Labor", qty: 1, price: 220.00 },
      ]
    },
    { 
      id: 8971, 
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=60", 
      make: "Ford", 
      model: "F-150",
      year: 2020,
      customerName: "Jennifer Brown",
      phone: "555-234-5678",
      vin: "1FT8765432109876",
      date: "2023-06-25",
      status: "Open",
      items: [
        { desc: "Suspension Check", qty: 1, price: 75.00 },
      ]
    },
    { 
      id: 4521, 
      image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=60", 
      make: "Honda", 
      model: "Civic",
      year: 2017,
      customerName: "Robert Davis",
      phone: "555-345-6789",
      vin: "2HG876543210987",
      date: "2023-07-02",
      status: "Open",
      items: [
        { desc: "AC Repair", qty: 1, price: 250.00 },
        { desc: "Refrigerant", qty: 1, price: 65.00 },
      ]
    },
    { 
      id: 8907, 
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=60", 
      make: "Mercedes", 
      model: "C-Class",
      year: 2021,
      customerName: "Emily Martinez",
      phone: "555-567-8901",
      vin: "WDD98765432109",
      date: "2023-06-30",
      status: "Open",
      items: [
        { desc: "Diagnostic", qty: 1, price: 120.00 },
        { desc: "Software Update", qty: 1, price: 85.00 },
      ]
    },
  ]);

  // Ongoing work sample (small avatars)
  const ongoing = [
    { id: 1111, title: "John - Oil Change", progress: 20, avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60" },
    { id: 2222, title: "Maria - Brake Fix", progress: 65, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=60" },
    { id: 3333, title: "Alex - Diagnostics", progress: 40, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60" },
  ];
  
  // Invoice download functionality
  const downloadInvoice = (order) => {
    // Build basic HTML invoice
    const total = (order.items || []).reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice - ${order.id}</title>
  <style>
    body { font-family: Inter, Roboto, Arial, sans-serif; padding:20px; color:#111 }
    h1 { color:#29cc6a }
    table { width:100%; border-collapse: collapse; margin-top:20px }
    th, td { text-align:left; padding:8px; border-bottom:1px solid #ddd }
    .total { font-weight:700; font-size:1.1rem; }
  </style>
</head>
<body>
  <h1>Invoice - ${order.id}</h1>
  <p><strong>Customer:</strong> ${order.customerName} • ${order.phone}</p>
  <p><strong>Vehicle:</strong> ${order.make} ${order.model} (${order.year}) • VIN: ${order.vin}</p>
  <p><strong>Date:</strong> ${order.date}</p>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
    <tbody>
      ${(order.items || [])
        .map(
          (it) =>
            `<tr><td>${it.desc}</td><td>${it.qty}</td><td>$${Number(it.price).toFixed(2)}</td><td>$${(
              (Number(it.price) || 0) *
              (Number(it.qty) || 1)
            ).toFixed(2)}</td></tr>`
        )
        .join("")}
    </tbody>
  </table>
  <p class="total">Total: $${Number(total).toFixed(2)}</p>
  <p>Generated by Contractor Dashboard</p>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Invoice downloaded");
  };
  
  // Filter work orders based on search query
  const filteredWorkOrders = useMemo(() => {
    if (!query) return workOrders;
    
    return workOrders.filter(order => 
      order.make.toLowerCase().includes(query.toLowerCase()) ||
      (order.model && order.model.toLowerCase().includes(query.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(query.toLowerCase())) ||
      (order.vin && order.vin.toLowerCase().includes(query.toLowerCase())) ||
      String(order.id).includes(query)
    );
  }, [workOrders, query]);

  // Helpers: workTypes selection toggle
  function toggleWorkTypeSelection(id) {
    setWorkTypes((prev) => prev.map((w) => (w.id === id ? { ...w, selected: !w.selected } : w)));
  }

  // Parts cart helpers
  function addPartToCart(part) {
    setPartsCart((prev) => {
      const found = prev.find((p) => p.id === part.id);
      if (found) return prev.map((p) => (p.id === part.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...part, qty: 1 }];
    });
  }
  function changeCartQty(id, delta) {
    setPartsCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p))
        .filter((p) => p.qty > 0)
    );
  }

  // Quote computation
  const quoteItems = useMemo(() => {
    // parts cart entries
    const parts = partsCart.map((p) => ({ id: p.id, title: p.title, qty: p.qty, unit: p.price, total: p.qty * p.price }));
    // labour/activity (simple fixed labour per selected workType)
    const labour = workTypes.filter((w) => w.selected).map((w) => ({
      id: `labour-${w.id}`,
      title: `${w.title} (labour)`,
      qty: 1,
      unit: 60, // example labour rate per unit
      total: 60,
    }));
    // other derived items (e.g., activity checks)
    const repairs = [];
    Object.entries(activity.repairs).forEach(([k, v]) => {
      if (v) {
        repairs.push({ id: `repair-${k}`, title: k.replace(/([A-Z])/g, " $1"), qty: 1, unit: 25, total: 25 });
      }
    });
    return [...parts, ...labour, ...repairs];
  }, [partsCart, workTypes, activity]);

  const subtotal = useMemo(() => quoteItems.reduce((s, it) => s + (it.total || 0), 0), [quoteItems]);
  const tax = +(subtotal * 0.12).toFixed(2); // example 12% tax
  const grandTotal = +(subtotal + tax).toFixed(2);

  // Wizard navigation
  function goNext() {
    if (step < steps.length) setStep(step + 1);
  }
  function goPrev() {
    if (step > 1) setStep(step - 1);
  }
  function resetWizard() {
    setStep(1);
    setCustomer({ name: "", phone: "" });
    setVehicle({ make: "", model: "", vin: "", year: "", odometer: "", confirmOdometer: "", trim: "" });
    setWorkTypes(initialWorkTypes);
    setPartsCart([]);
    setActivity({
      type: "Inspection",
      description: "",
      repairs: { engineCheck: false, ecuTesting: false, acService: false, brake: false, oilChange: false, other: false },
    });
  }

  // Event handlers
  const handleCreateClick = () => {
    setActiveTab("create");
    setStep(1);
  };

  const handleOrdersClick = () => {
    setActiveTab("orders");
  };

  const handleNotificationsClick = () => {
    setActiveTab("notifications");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    // Close modal
    setShowLogoutModal(false);
    
    // Redirect to login selection
    window.location.href = '/loginselection';
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleSubmitWorkOrder = () => {
    // Create new work order from wizard data
    const newWorkOrder = {
      id: Math.floor(Math.random() * 9000) + 1000, // Generate random 4-digit ID
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=60", // Default image
      make: vehicle.make || "Unknown",
      model: vehicle.model || "Unknown",
      year: vehicle.year || new Date().getFullYear(),
      customerName: customer.name || "Unknown Customer",
      phone: customer.phone || "",
      vin: vehicle.vin || "",
      date: new Date().toISOString().split('T')[0],
      status: "Open",
      items: [
        ...partsCart.map(part => ({ desc: part.title, qty: part.qty, price: part.price })),
        { desc: "Labor", qty: 1, price: 60 } // Default labor charge
      ]
    };

    // Add to work orders list
    setWorkOrders(prev => [newWorkOrder, ...prev]);
    
    // Show success message
    setToast("Work Order Created Successfully!");
    
    // Reset wizard and go to home
    resetWizard();
    setActiveTab("home");
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CustomerInfo customer={customer} setCustomer={setCustomer} vehicle={vehicle} setVehicle={setVehicle} />;
      case 2:
        return <WorkTypes workTypes={workTypes} toggleWorkTypeSelection={toggleWorkTypeSelection} />;
      case 3:
        return <SpareParts spareCatalog={spareCatalog} partsCart={partsCart} addPartToCart={addPartToCart} changeCartQty={changeCartQty} />;
      case 4:
        return <ActivityDetails activity={activity} setActivity={setActivity} />;
      case 5:
        return <Quote quoteItems={quoteItems} subtotal={subtotal} tax={tax} grandTotal={grandTotal} />;
      default:
        return null;
    }
  };

  // Render main content
  const renderMainContent = () => {
    if (activeTab === "home") {
      return (
        <>
          <Hero />
          <WorkOrdersList 
            workOrders={filteredWorkOrders} 
            selectedWorkOrder={selectedWorkOrder} 
            setSelectedWorkOrder={setSelectedWorkOrder} 
            onDownloadInvoice={downloadInvoice}
          />
          <OngoingWork ongoing={ongoing} onCreateClick={handleCreateClick} />
        </>
      );
    }

    if (activeTab === "create") {
      return (
        <div className="bg-white p-6 rounded-xl shadow">
          {/* Step header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Create Work Order</h2>
              <div className="text-sm text-gray-400">{`Step ${step} of ${steps.length}`}</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-500" onClick={resetWizard}>Reset</button>
              <div className="text-xs text-gray-400">Preview</div>
            </div>
          </div>

          {/* Step progress pills */}
          <div className="flex items-center gap-3 mb-6">
            {steps.map((s, i) => {
              const idx = i + 1;
              return (
                <div key={s} className={`flex items-center gap-2 ${idx === step ? "text-green-600" : "text-gray-500"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === step ? "bg-green-50" : "bg-gray-100"}`}>{idx}</div>
                  <div className="text-sm hidden md:block">{s}</div>
                  {i < steps.length - 1 && <div className="w-6 h-px bg-gray-200" />}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="space-y-6">
            {renderStepContent()}
          </div>

          {/* Wizard actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={goPrev} disabled={step === 1} className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 flex items-center gap-2">
                <ChevronLeft size={14} /> Previous
              </button>
              {step < steps.length && (
                <button onClick={goNext} className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2">
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step === steps.length && (
                <button onClick={handleSubmitWorkOrder} className="px-5 py-2 bg-green-600 text-white rounded-lg cursor-pointer">
                  Submit Work Order
                </button>
              )}

              <button onClick={resetWizard} className="px-4 py-2 rounded-lg bg-gray-100 cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "notifications") {
      return <Notifications 
        notifications={notifications}
        onMarkRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onClearOne={clearNotification}
        onClearAll={clearAllNotifications}
      />;
    }

    if (activeTab === "orders") {
      return <Orders workOrders={workOrders} setWorkOrders={setWorkOrders} selectedWorkOrder={selectedWorkOrder} setSelectedWorkOrder={setSelectedWorkOrder} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800">
      {/* LEFT: rounded vertical navigation card */}
      <ContractorSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      {/* RIGHT: main content */}
      <div className="flex-1 p-8">
        {/* TOP row (search + small actions) */}
        <ContractorHeader 
          user={user} 
          userLoading={userLoading}
          onCreateClick={handleCreateClick} 
          query={query} 
          setQuery={setQuery} 
          notifications={notifications}
          markAllRead={markAllNotificationsRead}
          clearNotifications={clearAllNotifications}
        />
        
        {/* Toast notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-up">
            {toast}
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
                
                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to logout? You will need to sign in again to access your dashboard.
                </p>
                
                {/* Buttons */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN GRID: left (content) & right (preview) */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: large content */}
          <div className="col-span-8">
            {renderMainContent()}
          </div>

          {/* RIGHT: preview / details */}
          <div className="col-span-4">
            <div className="sticky top-8 space-y-4">
              <QuickActions 
                activeTab={activeTab}
                onCreateClick={handleCreateClick}
                onOrdersClick={handleOrdersClick}
                onNotificationsClick={handleNotificationsClick}
              />
              <WorkOrderPreview 
            selectedWorkOrder={selectedWorkOrder} 
            setWorkOrders={setWorkOrders}
            setSelectedWorkOrder={setSelectedWorkOrder}
          />
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
