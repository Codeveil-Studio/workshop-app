// PersonalInformation.jsx
import React, { useRef, useState } from "react";

/**
 * PersonalInformation.jsx
 * React + Vite + Tailwind component that matches the provided design.
 *
 * Notes:
 * - Uses exact accent color #29cc6a via Tailwind arbitrary color classes (e.g. bg-[#29cc6a]).
 * - Replace avatar src with your real image or wire file upload handler as needed.
 */

export default function PersonalInformation() {
  const [form, setForm] = useState({
    name: "John Smith",
    email: "johnsmith@trt.com",
    phone: "",
    address: "",
    company: "",
    companyAddress: "",
  });

  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(
    // placeholder avatar (Unsplash). Replace with your resource if desired.
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256&auto=format&fit=crop&crop=faces"
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    // Demo behaviour — hook up submission as needed.
    alert("Personal information saved (demo).");
  }

  function onClickChangeAvatar() {
    fileInputRef.current?.click();
  }

  function onAvatarPicked(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  }

  return (
    <div className="w-full">
      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow border-t-2 border-[#29cc6a]">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left column (title + help text) */}
            <div className="md:col-span-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Personal Information
              </h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            {/* Right column (form) */}
            <form
              onSubmit={handleSave}
              className="md:col-span-9 space-y-4 relative"
            >
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a] resize-none"
                  />
                </div>

                {/* Company name */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Company name
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a]"
                  />
                </div>

                {/* Company address */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Company address
                  </label>
                  <textarea
                    name="companyAddress"
                    value={form.companyAddress}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#29cc6a] focus:border-[#29cc6a] resize-none"
                  />
                </div>
              </div>

              {/* Avatar row */}
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={onClickChangeAvatar}
                        className="text-sm px-3 py-1 border border-gray-200 rounded-md text-gray-700 bg-white hover:shadow-sm"
                      >
                        Change
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onAvatarPicked}
                        className="hidden"
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        JPG, PNG — max 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save button - modified positioning */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#29cc6a] px-4 py-2 text-sm font-medium text-white shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
