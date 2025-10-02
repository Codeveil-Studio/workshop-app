import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
 */
export default function ContractorDashboard({ user = { name: "John Doe", email: "john@example.com" } }) {
  const [activeTab, setActiveTab] = useState("home"); // home | create | notifications | orders
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

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
    { id: "engine", title: "Engine", img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60", qty: 0 },
    { id: "brakes", title: "Brakes", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=60", qty: 0 },
    { id: "electrical", title: "Electrical", img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60", qty: 0 },
    { id: "suspension", title: "Suspension", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=60", qty: 0 },
    { id: "hvac", title: "HVAC", img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60", qty: 0 },
    { id: "others", title: "Other", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=60", qty: 0 },
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

  // sample work orders for the Home grid
  const workOrders = [
    { id: 7836, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=60", make: "BMW", year: 2018 },
    { id: 4566, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=60", make: "Audi", year: 2019 },
    { id: 5966, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=60", make: "Toyota", year: 2016 },
    { id: 8971, image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=60", make: "Ford", year: 2020 },
    { id: 4521, image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=60", make: "Honda", year: 2017 },
    { id: 8907, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=60", make: "Mercedes", year: 2021 },
  ];

  // Ongoing work sample (small avatars)
  const ongoing = [
    { id: 1111, title: "John - Oil Change", progress: 20, avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60" },
    { id: 2222, title: "Maria - Brake Fix", progress: 65, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=60" },
    { id: 3333, title: "Alex - Diagnostics", progress: 40, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60" },
  ];

  // Helpers: workTypes qty change
  function changeWorkTypeQty(id, delta) {
    setWorkTypes((prev) => prev.map((w) => (w.id === id ? { ...w, qty: Math.max(0, w.qty + delta) } : w)));
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
    const labour = workTypes.filter((w) => w.qty > 0).map((w) => ({
      id: `labour-${w.id}`,
      title: `${w.title} (labour)`,
      qty: w.qty,
      unit: 60, // example labour rate per unit
      total: w.qty * 60,
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

  const handleSubmitWorkOrder = () => {
    // Submit mock
    alert("Work Order Created — (mock). Resetting wizard.");
    resetWizard();
    setActiveTab("home");
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CustomerInfo customer={customer} setCustomer={setCustomer} vehicle={vehicle} setVehicle={setVehicle} />;
      case 2:
        return <WorkTypes workTypes={workTypes} changeWorkTypeQty={changeWorkTypeQty} />;
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
            workOrders={workOrders} 
            selectedWorkOrder={selectedWorkOrder} 
            setSelectedWorkOrder={setSelectedWorkOrder} 
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
                <button onClick={handleSubmitWorkOrder} className="px-5 py-2 bg-green-600 text-white rounded-lg">
                  Submit Work Order
                </button>
              )}

              <button onClick={resetWizard} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "notifications") {
      return <Notifications />;
    }

    if (activeTab === "orders") {
      return <Orders />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800">
      {/* LEFT: rounded vertical navigation card */}
      <ContractorSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* RIGHT: main content */}
      <div className="flex-1 p-8">
        {/* TOP row (search + small actions) */}
        <ContractorHeader user={user} onCreateClick={handleCreateClick} />

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
                onCreateClick={handleCreateClick}
                onOrdersClick={handleOrdersClick}
                onNotificationsClick={handleNotificationsClick}
              />
              <WorkOrderPreview selectedWorkOrder={selectedWorkOrder} />
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
