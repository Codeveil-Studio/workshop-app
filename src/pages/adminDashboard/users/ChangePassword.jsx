// ChangePassword.jsx
import React, { useState } from "react";
// import { LockClosedIcon } from "@heroicons/react/24/solid";

/**
 * ChangePassword.jsx
 * React + Vite + Tailwind component to match the provided Change Password design.
 * Accent color: #29cc6a
 */

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Hook your password change logic here
    alert("Password changed successfully (demo).");
  }

  return (
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow border-t-2 border-[#29cc6a]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left column (icon + title + description) */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-3">
                  <LockClosedIcon className="w-10 h-10 text-[#29cc6a]" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Change Password
                  </h2>
                </div>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Change your password for a new one, valid for the next login.
                </p>
              </div>

              {/* Right column (form) */}
              <form
                onSubmit={handleSubmit}
                className="md:col-span-9 space-y-4"
              >
                <div className="space-y-5">
                  {/* Current password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Current password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      placeholder="Your current password"
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                    />
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      New password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Your new password"
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                    />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                    />
                  </div>
                </div>

                {/* Button aligned bottom-right */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#29cc6a] px-4 py-2 text-sm font-medium text-white shadow"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}
