import React from "react";

export default function CustomerInfo({ customer, setCustomer, vehicle, setVehicle }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-green-600 mb-3">Customer Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <input 
          className="border p-2 rounded" 
          placeholder="Customer Name" 
          value={customer.name} 
          onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Phone Number" 
          value={customer.phone} 
          onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} 
        />
      </div>

      <h3 className="text-sm font-semibold text-green-600 mt-6 mb-2">Vehicle Information</h3>
      <div className="grid grid-cols-3 gap-3">
        <input 
          className="border p-2 rounded" 
          placeholder="Make" 
          value={vehicle.make} 
          onChange={(e) => setVehicle((v) => ({ ...v, make: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Model" 
          value={vehicle.model} 
          onChange={(e) => setVehicle((v) => ({ ...v, model: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="VIN" 
          value={vehicle.vin} 
          onChange={(e) => setVehicle((v) => ({ ...v, vin: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Year" 
          value={vehicle.year} 
          onChange={(e) => setVehicle((v) => ({ ...v, year: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Odometer" 
          value={vehicle.odometer} 
          onChange={(e) => setVehicle((v) => ({ ...v, odometer: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Confirm Odometer" 
          value={vehicle.confirmOdometer} 
          onChange={(e) => setVehicle((v) => ({ ...v, confirmOdometer: e.target.value }))} 
        />
        <input 
          className="border p-2 rounded col-span-3" 
          placeholder="Trim" 
          value={vehicle.trim} 
          onChange={(e) => setVehicle((v) => ({ ...v, trim: e.target.value }))} 
        />
      </div>

      <div className="mt-4">
        <button className="px-4 py-2 bg-gray-100 rounded-lg">Upload Vehicle Photos</button>
      </div>
    </div>
  );
}
