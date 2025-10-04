import React from "react";
// import heroImage from "../../../assets/images/Maskgroup.png";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-6 mb-6 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Create & Search Work Easily</h2>
        <p className="text-sm text-gray-600 mt-1">Manage all your work orders, spare parts and activities from a single dashboard.</p>
      </div>
      <div className="w-40 h-24 bg-white rounded-lg flex items-center justify-center shadow">
        <img src="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=60" alt="hero" className="object-cover w-full h-full rounded-lg" />
      </div>
    </div>
  );
}
