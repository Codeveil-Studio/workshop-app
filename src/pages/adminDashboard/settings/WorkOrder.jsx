// Settings.jsx
import React, { useState } from "react";
import ActivitiesList from "./ActivitiesList";
import EditActivityCard from "./EditActivityCard";
import EditPaintCode from "./EditPaintCode";
import EditWorkOrder from "./EditWorkOrder";

/**
 * Arrow icon as specified
 */
function ArrowIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 14 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.599866 19.9999L8.59989 11.9999L0.599868 3.9999L2.19987 0.799886L13.3999 11.9999L2.19987 23.2L0.599866 19.9999Z"
                fill="currentColor"
            />
        </svg>
    );
}

/**
 * Settings.jsx
 * React + Vite + Tailwind component that matches the Settings list design.
 * Accent color: #29cc6a
 */

export default function WorkOrder({ settingsState, setSettingsState, onBack }) {
    const workOrderSetting = settingsState.workOrderSetting

    const items = [
        "Add New Category",
        "Edit Category",
        "Edit Word Order Details",
        "Edit Paint Code Details",
    ];

    // If a work order setting is selected, show the corresponding component
    if (workOrderSetting === "Add New Category") {
        return <EditActivityCard onBack={() => setSettingsState(prev => ({ ...prev, workOrderSetting: null }))} />;
    }
    if (workOrderSetting === "Edit Category") {
        return <ActivitiesList 
          settingsState={settingsState}
          setSettingsState={setSettingsState}
          onBack={() => setSettingsState(prev => ({ ...prev, workOrderSetting: null }))} 
        />;
    }
    
    if (workOrderSetting === "Edit Word Order Details") {
        return <EditWorkOrder  
          settingsState={settingsState}
          setSettingsState={setSettingsState}
          onBack={() => setSettingsState(prev => ({ ...prev, workOrderSetting: null }))} 
        />;
    }
    if (workOrderSetting === "Edit Paint Code Details") {
        return <EditPaintCode  
          settingsState={settingsState}
          setSettingsState={setSettingsState}
          onBack={() => setSettingsState(prev => ({ ...prev, workOrderSetting: null }))} 
        />;
    }

    return (
        <div className="bg-white rounded-lg shadow border-t-2 border-[#29cc6a] shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                    <li key={idx}>
                        <button
                            type="button"
                            onClick={() => setSettingsState(prev => ({ ...prev, workOrderSetting: item }))}
                            className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold hover:bg-gray-50 focus:outline-none"
                        >
                            <span className="text-base text-gray-700">{item}</span>
                            <ArrowIcon className="w-3.5 h-3.5 text-gray-800" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
